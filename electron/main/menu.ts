import { app, Menu, MenuItemConstructorOptions, BrowserWindow } from 'electron'

export function useApplicationMenu(win: BrowserWindow) {
  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: 'Action',
      submenu: [
        {
          label: "Show",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            win.show()
          },
        },
        {
          label: "Hide",
          accelerator: "CmdOrCtrl+W",
          click: () => {
            win.hide()
          },
        },
      ]
    },
    {
      label: 'About',
      submenu: [
        {
          label: "Show Help",
          accelerator: "CmdOrCtrl+H",
          click: () => {
            console.log('帮助')
          },
        }
      ]
    },
  ]

  if (process.platform === 'darwin') {
    menuTemplate.unshift({
      label: app.getName(),
      submenu: [
        {
          label: 'Exit App',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            win.destroy()
            app.quit()
          }
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(menuTemplate)

  Menu.setApplicationMenu(menu)
}


// macOS Only: set dock menu
export const dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Window',
    click() { console.log('New Window') }
  }, {
    label: 'New Window with Settings',
    submenu: [
      { label: 'Basic' },
      { label: 'Pro' }
    ]
  },
  { label: 'New Command...' }
])
