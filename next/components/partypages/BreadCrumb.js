export default function BreadCrumb() {
  return (<>
 <nav
    aria-label="breadcrumb"
    className="BC-gw"
  >
    <ol className="breadcrumb p">
      <li className="breadcrumb-item">
        <a href="#">
          全台棋牌室
        </a>
      </li>
      <li className="breadcrumb-item">
        <a href="#">
          參團
        </a>
      </li>
      <li className="breadcrumb-item">
        <a href="#">
          北區
        </a>
      </li>
      <li
        aria-current="page"
        className="breadcrumb-item active"
      >
        麻將大師板橋一店
      </li>
    </ol>
  </nav>

  </>
   
  );
}