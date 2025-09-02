'use client';

import { useState } from 'react';
import css from './TagsMenu.module.css';
import Link from 'next/link';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

const tagsList: string[] = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div
      className={css.menuContainer}
      //   onMouseEnter={() => setIsOpen(true)}
      //   onMouseLeave={() => setIsOpen(false)}
    >
      <button className={css.menuButton} onClick={toggle}>
        <p>Notes</p>
        {isOpen ? <FaCaretUp /> : <FaCaretDown />}
      </button>

      {isOpen && (
        <ul className={css.menuList}>
          {tagsList.map((tag) => (
            <li className={css.menuItem} key={tag}>
              <Link href={`/notes/filter/${tag}`} className={css.menuLink} onClick={toggle}>
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TagsMenu;
