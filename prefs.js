import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const GeneralSettingPage = GObject.registerClass(
class GeneralSettingPage extends Adw.PreferencesPage {
    _init(extensionObject) {
        super._init({
            title: _('General'),
            icon_name: 'org.gnome.Settings-symbolic',
        });
        
        const group = new Adw.PreferencesGroup({
            title: _('Appearence'),
            description: _('In this section you can manage the appearence settings'),
        });

        this.add(group);

        // Create a new preferences row
        const show_icon_row = new Adw.SwitchRow({
            title: _('Proxy activated icon'),
            subtitle: _('Select to showing the proxy system icon when proxy is activated'),
        });

        group.add(show_icon_row);
    }
});

const ProxiesSettingPage = GObject.registerClass(
class ProxiesSettingPage extends Adw.PreferencesPage {
    _init(extensionObject) {
        super._init({
            title: _('Proxies'),
            icon_name: 'preferences-system-network-proxy-symbolic',
        });

        const available_proxy_group = new Adw.PreferencesGroup({
            title: _('Available proxy'),
        });

        let add_proxy_button = new Gtk.Button({
            child: new Adw.ButtonContent({
                label: _('Add proxy'),
                icon_name: 'list-add-symbolic',
            }),
        });

        add_proxy_button.add_css_class('suggested-action');
        add_proxy_button.set_margin_top(10);
        add_proxy_button.set_margin_bottom(10);
        add_proxy_button.connect('clicked', () => {
            this.remove(available_proxy_group)
            
            const configuration_types = new Gtk.StringList(['manual', 'automatic'])

            const configuration_type_group = new Adw.PreferencesGroup();
            
            configuration_type_group.add(new Adw.ComboRow({
                title: _('Configuration'),
                model: configuration_types,
            }));

            this.add(configuration_type_group);
        
        });
        available_proxy_group.set_header_suffix(add_proxy_button);
        
        this.add(available_proxy_group);
    }
});

export default class ExamplePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {

        // Create a preferences page, with a single group
        window.add(new GeneralSettingPage());
        window.add(new ProxiesSettingPage());
       
        // Create a settings object and bind the row to the `show-indicator` key
        window._settings = this.getSettings();
    }
}