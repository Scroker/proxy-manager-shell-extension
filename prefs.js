import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class ExamplePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Create a preferences page, with a single group
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Select default proxy'),
            description: _('This is a concept and not wotking at all for now'),
        });
        group.set_header_suffix(new Gtk.Button({
            label: _('Add proxy'),
            icon_name: 'list-add-symbolic',
        }))
        page.add(group);

        // Create a new preferences row
        const row1 = new Adw.SwitchRow({
            title: _('Proxy two'),
            subtitle: _('Select to enable the proxy'),
        });
        const row2 = new Adw.SwitchRow({
            title: _('Proxy one'),
            subtitle: _('Select to enable the proxy'),
        });
        group.add(row1);
        group.add(row2);

        // Create a settings object and bind the row to the `show-indicator` key
        window._settings = this.getSettings();
    }
}