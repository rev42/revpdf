<?php
/**
 * Created by JetBrains PhpStorm.
 * User: oc
 * Date: 16/03/13
 * Time: 10:37
 * To change this template use File | Settings | File Templates.
 */

namespace RevPDF\Controller;

use Silex\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Silex\Provider\SecurityServiceProvider;


use RevPDF\Repository\User;
use RevPDF\Repository\UserProvider;

use RevPDF\Form\UserLoginType;
use RevPDF\Form\UserLoginOpenIDType;
use RevPDF\Form\UserSignupType;

use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class Security implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $app->register(new SecurityServiceProvider());
        $controller = new ControllerCollection($app['route_factory']);

        $app['security.firewalls'] = array(
            // Not securing login path
            'login' => array(
                'pattern' => '^/[a-z]{2}/login$',
                'anonymous'=>true
            ),
            // Not securing this path
            'login_google_openid' => array(
                'pattern' => '^/[a-z]{2}/login/with/google/openid$',
                'anonymous'=>true
            ),
            'login_google_openid' => array(
                'pattern' => '^/[a-z]{2}/login/with/google$',
                'anonymous'=>true
            ),
            // Not securing signup path
            'signup' => array(
                'pattern' => '^/[a-z]{2}/signup$',
                'anonymous'=>true
            ),
            // Not securing signup_confirmation path
            'signup_confirmation' => array(
                'pattern' => '^/[a-z]{2}/signup/confirm/[a-zA-Z0-9]+$',
                'anonymous'=>true
            ),
            // Securing all other paths
            'secured' => array(
                'pattern' => '^.*$',
                'form' => array(
                    // l'utilisateur est redirigé ici quand il/elle a besoin de se connecter
                    'login_path' => '/fr/login',
                    // soumet le formulaire de login vers cette URL
                    'check_path' => '/login_check',
                ),
                'logout' => array('logout_path' => '/logout'),
                'users' => $app->share(function () use ($app) {
                    return new UserProvider($app['db']);
                }),
            ),
        );

        $app['security.role_hierarchy'] = array(
            'ROLE_ADMIN' => array('ROLE_USER', 'ROLE_ALLOWED_TO_SWITCH'),
        );

        $app['security.access_rules'] = array(
            array('^/admin', 'ROLE_ADMIN'),
        );

        /**
         * Route : show login forms
         */
        $controller->match('/{locale}/login', function(Request $request) use ($app) {
                $form = $app['form.factory']->createBuilder(
                    new UserLoginType()
                )->getForm();

                $formSSO = $app['form.factory']->createBuilder(
                    new UserLoginOpenIDType()
                )->getForm();

                return $app['twig']->render('Security/login.html.twig', array(
                        'form'          => $form->createView(),
                        'formSSO'       => $formSSO->createView(),
                        'error'         => $app['security.last_error']($request),
                        'last_username' => $app['session']->get('_security.last_username'),
                    ));
            })->bind('route.user.login');


        $controller->match('/logout', function(Request $request) use ($app) {
            $app['session']->clear();
        })->bind('route.user.logout');


        /**
         * Route : show signup form
         */
        $controller->get('/{locale}/signup', function(Request $request) use ($app) {
            $form = $app['form.factory']->createBuilder(
                new UserSignupType()
            )->getForm();

            return $app['twig']->render('Security/signup.html.twig', array(
                    'form' => $form->createView()
                ));
        })->bind('route.user.signup');



        /**
         * Route : confirmation link to activate an account using token
         */
        $controller->get('/{locale}/signup/confirm/{confirmationToken}', function(Request $request) use ($app) {
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




        $controller->post('/{locale}/signup', function(Request $request) use ($app) {
                $form = $app['form.factory']->createBuilder(
                    new UserSignupType()
                )->getForm();

                $form->bind($app['request']);
                $data = $form->getData();

                if ($form->isValid()) {
                    $app['monolog']->addDebug('Checking existing user with mail: ' . $data['mail']);

                    $userProvider = new UserProvider($app['db']);
                    $user = $this->checkUserExist($userProvider, $data['mail']);

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
                        $app['monolog']->addDebug('Adding new user with those values: ' . json_encode($data));
                        $resCreateUser = $this->createUser($app, $data['firstname'], $data['lastname'], $data['roles'], $data['enabled'], $data['mail'], $data['password']);

                        if ($resCreateUser <= 0) {
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




        $controller->match('/{locale}/login/with/google', function(Request $request) use ($app) {
                $formSSO = $app['form.factory']->createBuilder(new UserLoginOpenIDType())->getForm();
                $formSSO->bind($app['request']);
                $data = $formSSO->getData();

                if (!$app['session']->has('username')) {
                    $openid = new \LightOpenID($_SERVER['SERVER_NAME']);

                    if (!$openid->mode) {
                        $openid->identity = $data['openid_identifier'];
                        $openid->required = array(
                            'email' => 'contact/email',
                            'firstname' => 'namePerson/first',
                            'lastname' => 'namePerson/last'
                        );

                        return $app->redirect($openid->authUrl());
                    } else {
                        // Provider returns valid data
                        if ($openid->validate()) {
                            $attributes = $openid->getAttributes();
                            $app['monolog']->addDebug('Successfully logged in using openid');

                            $userProvider = new UserProvider($app['db']);
                            $user = $this->checkUserExist($userProvider, $attributes['contact/email']);

                            if ($user) {
                                $user = $userProvider->loadUserByUsername($attributes['contact/email']);
                                if (!$user->isEnabled()) {
                                    $app['monolog']->addDebug('User exists but not enabled');
                                    $app['session']->setFlash('warning', 'message.user.signup.user_already_exist_but_not_validated');

                                    $app->redirect($app['url_generator']->generate('homepage', array('locale' => $app['locale'])));
                                } else {
                                    $token = new UsernamePasswordToken($user, $user->getPassword(), 'secured', $user->getRoles());
                                    $app['session']->set('_security_secured', serialize($token));
                                    $app['session']->set('username', $user->getUsername());
                                }
                            } else {
                                $data = array();
                                $data['firstname'] = $attributes['namePerson/first'];
                                $data['lastname'] = $attributes['namePerson/last'];
                                $data['roles'] = 'ROLE_USER';
                                $data['mail'] = $attributes['contact/email'];
                                $data['enabled'] = true;
                                $data['password'] = 'password';
                                $app['monolog']->addDebug('Adding new user with those values: ' . json_encode($data));
                                $resCreateUser = $this->createUser($app, $data['firstname'], $data['lastname'], $data['roles'], $data['enabled'], $data['mail'], $data['password']);
                                if ($resCreateUser <= 0) {
                                    $app['monolog']->addDebug('User cannot be created');
                                    $app['session']->setFlash('warning', 'Your account has not been created. Please try again.');

                                    return $app['twig']->render('Security/login.html.twig', array(
                                            'form' => $formSSO->createView(),
                                            'post' => $data,
                                        ));
                                }
                                $userProvider = new UserProvider($app['db']);
                                $user = $this->checkUserExist($userProvider, $attributes['contact/email']);
                                if ($user) {
                                    $user = $userProvider->loadUserByUsername($attributes['contact/email']);
                                    $token = new UsernamePasswordToken($user, $user->getPassword(), 'secured', $user->getRoles());
                                    $app['session']->set('_security_secured', serialize($token));
                                    $app['session']->set('username', $user->getUsername());
                                }
                            }
                        }
                    }
                }

                if (isset($app['auth']) && !$app['auth']($app['session']->get('username'))) {
                    $app['monolog']->addDebug('Something got wrong with authentification');

                    return new Response($app['twig']->render('500.html.twig'), 403);
                }

                $app['twig']->addGlobal('username', $app['session']->get('username'));
                $app['session']->setFlash('success', $app['translator']->trans('message.user.loggedin.as', array('%username%' => $app['session']->get('username'))));

                return $app->redirect($app['url_generator']->generate(
                        'homepage',
                        array('locale' => $app['locale'])
                    ));
            })->bind('route.user.check_login_sso');



        return $controller;
    }

    /**
     * Check if user exists
     *
     * @param UserProvider $userProvider
     * @param $identifier
     *
     * @return bool|null
     */
    public function checkUserExist(UserProvider $userProvider, $identifier) {
        $user = $userProvider->getUser($identifier);
        if ($user) {
            return $user;
        } else {
            return false;
        }
    }

    public function createUser($app, $firstname, $lastname, $role, $enabled, $mail, $password) {
        $data['firstname'] = $firstname;
        $data['lastname'] = $lastname;
        $data['roles'] = $role;
        $data['enabled'] = $enabled;
        $data['mail'] = $mail;
        $user = new User($mail, '', $mail, '', explode(',', $data['roles']), false, true, true, true);
        $data['password'] = $app['security.encoder_factory']->getEncoder($user)->encodePassword($password, $user->getSalt());
        $app['monolog']->addDebug('Adding new user with those values: ' . json_encode($data));

        return $app['repository.user']->insert($data);
    }
}