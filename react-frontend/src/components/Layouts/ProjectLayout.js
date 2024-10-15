import AppSideBar from "./appSideBar/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import BookDetailsPage from "../BookDetailsPage/BookDetailsPage";
import AuthorDetailsPage from "../AuthorDetailsPage/AuthorDetailsPage";
import SaleDetailsPage from "../SaleDetailsPage/SaleDetailsPage";
import ReviewDetailsPage from "../ReviewDetailsPage/ReviewDetailsPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "bookDetails":
                return <BookDetailsPage />;
case "authorDetails":
                return <AuthorDetailsPage />;
case "saleDetails":
                return <SaleDetailsPage />;
case "reviewDetails":
                return <ReviewDetailsPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;
