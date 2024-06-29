import nav from '@styles/nav.module.scss';
function Footer() {
  return (
    <div className={nav.footer}>
      <div className={nav.footer_flex_container}>
        <div className={nav.footer_container}>
          <span className={nav.footer_project}>SEDA LOCKER</span>
          <span className={nav.footer_author}>gh:thezoot3</span>
        </div>
        <div className={nav.footer_container}>
          <span className={nav.footer_osl}>OPEN SOURCE LICENSE</span>
        </div>
      </div>
    </div>
  );
}
export default Footer;
