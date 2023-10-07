/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Gio from 'gi://Gio';

import GObject from 'gi://GObject';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const ProxyMenuToggle = GObject.registerClass(
class ProxyMenuToggle extends QuickSettings.QuickMenuToggle {
    _init(extensionObject) {
        super._init({
            title: _('Proxy'),
            subtitle: _('Beta Version'),
            iconName: 'preferences-system-network-proxy-symbolic',
            toggleMode: true,
        });

        // Binging the toggle to a GSettings key
        this._settings = extensionObject.getSettings();
        this._settings.bind('feature-enabled',
            this, 'checked',
            Gio.SettingsBindFlags.DEFAULT);

        // Add a header with an icon, title and optional subtitle. This is
        // Reccomanded for consistency with other quick settings menus.
        this.menu.setHeader('preferences-system-network-proxy-symbolic', _('Proxy'), _('Enable/Disable proxy'));

        // Add a section of items to the menu
        this._itemsSection = new PopupMenu.PopupMenuSection();
        this._itemsSection.addAction(_('Proxy PICO'), () => console.debug('Menu item 1 selected!'));
        this._itemsSection.addAction(_('Proxy IBM'), () => console.debug('Menu item 1 selected!'));
        this.menu.addMenuItem(this._itemsSection);

        // Add an entry point for more settings
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        const settingsItem = this.menu.addAction('Settings', () => estensionObject.openPreferences());

        // Ensure the settings are unavailable when the screen is locked
        settingsItem.visible = Main.sessionMode.allowSettings;
        this.menu._settingsActions[extensionObject.uuid] = settingsItem;
    }
});

const ProxyIndicator = GObject.registerClass(
class ProxyIndicator extends QuickSettings.SystemIndicator {
    _init(extensionObject) {
        super._init();

        // Create an icon for the indicator
        this._indicator = this._addIndicator();
        this._indicator.iconName = 'preferences-system-network-proxy-symbolic';

        //Show an indicator when the feature is enabled
        
        this._settings = extensionObject.getSettings();
        this._settings.bind('feature-enabled',
            this._indicator, 'visible',
            Gio.SettingsBindFlags.DEFAULT);
    }
});

export default class QuickSettingsProxyManagerExtension extends Extension {
    
    enable() {
        this._indicator = new ProxyIndicator(this);
        this._indicator.quickSettingsItems.push(new ProxyMenuToggle(this));
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }

    disable() {
        this._indicator.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
        this._indicator = null;
    }
}
