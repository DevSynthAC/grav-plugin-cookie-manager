<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;

class CookieManagerPlugin extends Plugin
{
    // Register the primary initialized event hooks
    public static function getSubscribedEvents(): array
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 0]
        ];
    }

    // Initialize only if on the frontend interface
    public function onPluginsInitialized(): void
    {
        if ($this->isAdmin()) {
            return;
        }

        // 1. Process Form Form Actions (Before Page Rendering Begins)
        $this->processCookieForm();

        // 2. Enable Front-End Hooks
        $this->enable([
            'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
            'onTwigSiteVariables' => ['onTwigSiteVariables', 0]
        ]);
    }

    /**
     * Handles Server-Side POST Submissions safely within Grav Context
     */
    protected bool $cookie_has_cookie = false;

    protected function processCookieForm(): void
    {
        if (isset($_COOKIE['cookie_consent'])) {
            $this->cookie_has_cookie = true;
        }
    }

    // Inject custom CSS and JavaScript assets into the document header/footer
    public function onTwigSiteVariables(): void
    {
        $this->grav['assets']->addCss('plugin://cookie-manager/assets/cookie-manager.css');
        $this->grav['assets']->addJs('plugin://cookie-manager/assets/cookie-manager.js', ['group' => 'bottom']);

        $this->grav['twig']->twig_vars['cookie_has_cookie'] = $this->cookie_has_cookie;
    }

    // Extend Grav's template paths to read the plugin templates directory
    public function onTwigTemplatePaths(): void
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . '/templates';
    }
}
