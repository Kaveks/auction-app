interface CardProps{
    children:React.ReactNode;
    Padding:boolean;
}
const Card = ({children,Padding}:CardProps) => {
    let classes=" shadow-listShadow overflow-hidden rounded-md";
    if(Padding){
        classes += "p-4"
    }

    return ( 
        <div className={classes}>
            {children}
        </div>
     );
}
 
export default Card;