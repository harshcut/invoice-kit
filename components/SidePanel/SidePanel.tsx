import React from 'react';
import { useRouter } from 'next/router';
import { Nav, INavStyles, INavLinkGroup } from '@fluentui/react';

const SidePanel = (): React.ReactElement => {
  const router = useRouter();

  return (
    <Nav
      groups={groups}
      styles={styles}
      initialSelectedKey={router.pathname}
      onLinkClick={(ev, item) => {
        ev?.preventDefault();
        if (item?.url) return router.push(item.url);
      }}
    />
  );
};

const styles: Partial<INavStyles> = {
  root: {
    boxSizing: 'border-box',
    width: 250,
    height: '100vh',
    background: '#ffffff',
    paddingTop: '32px',
    textIndent: '10px',
    '[aria-current="page"]': {
      background: '#f2f2f2',
      color: '#0078d4',
    },
  },
  chevronButton: {
    fontSize: 14,
    fontWeight: 500,
    borderBottom: 'none',
    paddingLeft: 54,
  },
  chevronIcon: {
    marginLeft: 12,
  },
  link: {
    paddingLeft: 38,
  },
};

const groups: INavLinkGroup[] = [
  {
    name: 'Invoice',
    links: [
      {
        name: 'New Invoice',
        url: '/invoice/new',
        key: '/invoice/new',
        icon: 'AddToShoppingList',
      },
      {
        name: 'Invoice Transaction',
        url: '/invoice/all',
        key: '/invoice/all',
        icon: 'ZipFolder',
      },
    ],
  },
  {
    name: 'Customer',
    links: [
      {
        name: 'Create Customer',
        url: '/customer/new',
        key: '/customer/new',
        icon: 'PeopleAdd',
      },
      {
        name: 'Customer Master',
        url: '/customer/all',
        key: '/customer/all',
        icon: 'AccountManagement',
      },
    ],
  },
  {
    name: 'Service',
    links: [
      {
        name: 'Add Service',
        url: '/service/new',
        key: '/service/new',
        icon: 'WebComponents',
      },
      {
        name: 'Service Master',
        url: '/service/all',
        key: '/service/all',
        icon: 'ViewDashboard',
      },
    ],
  },
];

export default SidePanel;
