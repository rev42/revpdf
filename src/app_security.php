<?php

use Symfony\Component\HttpFoundation\Request;
use Silex\Provider\SecurityServiceProvider;


use RevPDF\Repository\User;
use RevPDF\Repository\UserProvider;

$app->register(new SecurityServiceProvider());

$app['security.firewalls'] = array(
    // Not securing login path
    'login' => array(
        'pattern' => '^/[a-z]{2}/login$',
    ),
    'login_sso' => array(
        'pattern' => '^/[a-z]{2}/loginSSO$',
    ),
    // Not securing signup path
    'signup' => array(
        'pattern' => '^/[a-z]{2}/signup$',
    ),
    // Not securing signup_confirmation path
    'signup_confirmation' => array(
        'pattern' => '^/[a-z]{2}/signup/confirm/[a-zA-Z0-9]+$',
    ),
    'secured' => array(
        'pattern' => '^.*$',
        'form' => array('login_path' => '/fr/login', 'check_path' => '/login_check'),
        'logout' => array('logout_path' => '/logout'),
        'users' => $app->share(function () use ($app) {
            return new RevPDF\Repository\UserProvider($app['db']);
        }),
    ),
);

$app['security.role_hierarchy'] = array(
    'ROLE_ADMIN' => array('ROLE_USER', 'ROLE_ALLOWED_TO_SWITCH'),
);

$app['security.access_rules'] = array(
    array('^/admin', 'ROLE_ADMIN'),
    array('^.*$', 'ROLE_USER'),
);



$app->match('/{locale}/login', function(Request $request) use ($app) {
    $form = $app['form.factory']->createBuilder(
        new \RevPDF\Form\UserLoginType()
    )->getForm();

    $formSSO = $app['form.factory']->createBuilder(
        new \RevPDF\Form\UserLoginSSOType()
    )->getForm();

    return $app['twig']->render('Security/login.html.twig', array(
        'form'          => $form->createView(),
        'formSSO'       => $formSSO->createView(),
        'error'         => $app['security.last_error']($request),
        'last_username' => $app['session']->get('_security.last_username'),
    ));
})->bind('route.user.login');




$app->match('/logout', function(Request $request) use ($app) {
})->bind('route.user.logout');



$app->get('/{locale}/signup', function(Request $request) use ($app) {
    $form = $app['form.factory']->createBuilder(
        new \RevPDF\Form\UserSignupType()
    )->getForm();

    return $app['twig']->render('Security/signup.html.twig', array(
        'form' => $form->createView()
    ));
})->bind('route.user.signup');



/**
 * Route : confirmation link to activate an account using token
 */
$app->get('/{locale}/signup/confirm/{confirmationToken}', function(Request $request) use ($app) {
    $confirmationToken = $app['request']->get('confirmationToken');
    if (!is_null($confirmationToken)) {
        $user = $app['repository.user']->findByConfirmationToken($confirmationToken);

        if ($user && $user->isEnabled() == 0) {
            $data['enabled'] = 1;
            $data['confirmation_token'] = null;
            $app['repository.user']->update($data, array('id' => $user->getId()));

            $app['monolog']->addDebug(sprintf('Account activated: %s (%d)', $user->getUsername(), $user->getId()));
            $app['session']->setFlash('warning', 'message.user.signup.success_enabling_account');

            return $app->redirect($app['url_generator']->generate(
                'homepage',
                array('locale' => $app['locale'])
            ));
        }
    }
    $app['monolog']->addDebug('Account has NOT been enabled or is already enabled');
    $app['session']->setFlash('warning', 'message.user.signup.failed_enabling_account');

    return $app->redirect($app['url_generator']->generate(
        'homepage',
        array('locale' => $app['locale'])
    ));
})->bind('route.user.register.confirmation');




$app->post('/{locale}/signup', function(Request $request) use ($app) {
    $form = $app['form.factory']->createBuilder(
        new \RevPDF\Form\UserSignupType()
    )->getForm();

    $form->bindRequest($app['request']);
    $data = $form->getData();

    if ($form->isValid()) {
        $app['monolog']->addDebug('Checking existing user with mail: ' . $data['mail']);
        $userProvider = new UserProvider($app['db']);
        $user = $userProvider->getUser($data['mail']);
        if ($user) {
            $user = $userProvider->loadUserByUsername($data['mail']);
            if (!$user->isEnabled()) {
                $app['monolog']->addDebug('User exists but not enabled');
                $app['session']->setFlash('warning', 'message.user.signup.user_already_exist_but_not_validated');

                return $app['twig']->render('Security/signup.html.twig', array(
                    'form' => $form->createView(),
                    'post' => $data,
                ));
            } else {
                $app['monolog']->addDebug('User already exists with this mail');
                $app['session']->setFlash('warning', 'message.user.signup.user_already_exist');

                return $app['twig']->render('Security/signup.html.twig', array(
                    'form' => $form->createView(),
                    'post' => $data,
                ));
            }
        } else {
            $app['monolog']->addDebug('user doesnt exist');
            $splittedFullname = explode(' ', $data['fullname'], 2);
            unset($data['fullname']);
            $data['firstname'] = isset($splittedFullname[0]) ? ucfirst($splittedFullname[0]) : '';
            $data['lastname'] = isset($splittedFullname[1]) ? ucfirst($splittedFullname[1]) : '';
            $data['roles'] = 'ROLE_USER';
            $data['enabled'] = false;
            $user = new User($data['mail'], '', '', explode(',', 'ROLE_USER'), false, true, true, true);
            $data['password'] = $app['security.encoder_factory']->getEncoder($user)->encodePassword($data['password'], $user->getSalt());
            $app['monolog']->addDebug('Adding new user with those values: ' . json_encode($data));

            if ($app['repository.user']->insert($data) <= 0) {
                $app['monolog']->addDebug('User cannot be created');
                $app['session']->setFlash('warning', 'Your account has not been created. Please try again.');

                return $app['twig']->render('Security/signup.html.twig', array(
                    'form' => $form->createView(),
                    'post' => $data,
                ));
            }
        }

        // refresh User with all data from DB
        $user = $userProvider->loadUserByUsername($data['mail']);
        $app['monolog']->addDebug('User created');

        $template = $app['twig']->loadTemplate('Security/Mail/mail/signup.html.twig');
        $mailData = array(
            'message_mail_activate_account' => $app['translator']->trans('message.mail.activate_account'),
            'message_mail_intro' => $app['translator']->trans('message.mail.intro'),
            'message_mail_ready_to_activate_account' => $app['translator']->trans('message.mail.ready_to_activate_account'),
            'message_mail_click_here' => $app['translator']->trans('message.mail.click_here'),
            'message_mail_href_validation' => $app['request']->getSchemeAndHttpHost().$app['url_generator']->generate(
                'route.user.register.confirmation',
                array('locale' => $app['locale'], 'confirmationToken' => $user->getConfirmationToken())
            )
        );
        $bodyHtml = $template->renderBlock('body_html', $mailData);
        $bodyText = $template->renderBlock('body_text', $mailData);

        $message = \Swift_Message::newInstance()
            ->setSubject($app['translator']->trans('lbl.mail.subject.account_confirmation'))
            ->setFrom(array($app['mailer.config.from']))
            ->setTo(array($data['mail']))
            ->setBody($bodyText, 'text/plain')
            ->addPart($bodyHtml, 'text/html');
        $app['mailer']->send($message);

        $app['session']->setFlash('success', 'message.user.signup_successful');
        $app['session']->setFlash('success', $app['translator']->trans('message.user.signup.please_validate_your_account', array('%mail%' => $data['mail'])));

        return $app->redirect($app['url_generator']->generate(
            'homepage',
            array('locale' => $app['locale'])
        ));
    }

    $app['session']->setFlash('warning', 'form.invalid.supply');

    return $app['twig']->render('Security/signup.html.twig', array(
        'form' => $form->createView(),
        'post' => $data,
    ));
})->bind('route.user.register');


$app->match('/login_sso', function(Request $request) use ($app) {
        var_dump(1);exit;

        $formSSO = $app['form.factory']->createBuilder(
            new \RevPDF\Form\UserLoginSSOType()
        )->getForm();

        $formSSO->bindRequest($app['request']);

        $data = $formSSO->getData();
        if ($formSSO->isValid()) {
            echo 'valiud';exit;
        }
        echo 1;exit;
    })->bind('route.user.check_login_sso');

