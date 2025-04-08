import React from 'react'
import { NavLink } from 'react-router';

export const ItemsNavbar = ({content, Route, href, isExternal = false}) => {
  if (isExternal) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-blue-500 text-3xl"
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={Route}
        // className={({ isActive }) =>
        //   isActive
        //     ? 'text-blue-500 font-semibold hover:text-blue-700'
        //     : 'text-white hover:text-blue-900'
        // }
      >
        {content}
      </NavLink>
    </li>
  );
}
