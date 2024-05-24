import React from 'react'
import MenuOptions from './menu-options'
type Props = {
  id: string
  type: 'agency' | 'subaccount'
}

const Sidebar = async ({ id, type }: Props) => {
  return (
    <>
    <MenuOptions
      defaultOpen={true}
      details={'details'}
      id={'id'}
      sidebarLogo={'sideBarLogo'}
      sidebarOpt={[]}
      subAccounts={[]}
      user={'user'}
    />
    {/* <MenuOptions
      details={details}
      id={id}
      sidebarLogo={sideBarLogo}
      sidebarOpt={sidebarOpt}
      subAccounts={subaccounts}
      user={user}
    /> */}
  </>
  )
}

export default Sidebar