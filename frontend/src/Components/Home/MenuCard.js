import { Card } from 'react-bootstrap'

const MenuCard = (props) =>{
    return(<div className="menuCardDiv"><Card onClick={props.onClick} className={props.c} bg={props.bg}><img src={props.img} className="card-img-top"></img><div className="card-img-overlay">{props.text}</div></Card></div>);
}

export default MenuCard;