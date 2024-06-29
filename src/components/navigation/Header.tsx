import nav from '@styles/nav.module.scss';
function Header() {
  return (
    <div className={nav.header}>
      <div className={nav.header_flex_container}>
        <span className={nav.header_icon}>lock_open</span>
        <span className={nav.header_title}>SEDA Locker</span>
      </div>
    </div>
  );
}

export default Header;
