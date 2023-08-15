
import SideNav from "../navigation/sideNav";

interface LayoutProps{
    children:React.ReactNode;
    hideSideNav:boolean;
}
const Layout = ({children,hideSideNav}:LayoutProps) => {
    let pageContentClasses=""
    if(hideSideNav===true){
        pageContentClasses += "w-full  "
    }else{
        pageContentClasses += " w-9/12"
    }
    return ( 
        <div className= "flex mx-1 md:m-3 mt-2 bg-appBg">
            { !hideSideNav &&(
                <div className="fixed md:static bottom-0 ml-2 mr-1 md:mr-3 w-3/12">
                    <SideNav />
                </div>
            )}
            <div className={pageContentClasses}>
                {children}
            </div>
            </div>

     );
}
 
export default Layout;