import "./Home.css";
import TrendingCocktails from "./TrendingCocktails";
import MenuCard from "./MenuCard";
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

const Home = (props) => {
    let history = useHistory();

    function scanRoute(){
        history.push('/scan');
    }
    function communityRoute(){
        history.push('/community');
    }
    function mybarRoute(){
        history.push('/mybar');
    }

    useEffect(() =>{
      props.navBar("");
    })

  return (
    <div className="homeContainer">
      <div className="homePage">
        <h1>Snap & Mix</h1>
        <TrendingCocktails />
        <div className="homeMenu">
          <MenuCard bg="danger" text="Scan" onClick={scanRoute} img="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/booze-hound-1607116758.jpg?crop=1.00xw:1.00xh;0,0&resize=980:*"/>
          <MenuCard bg="warning" text="Community" onClick={communityRoute} img="https://media.istockphoto.com/photos/birthday-celebratory-toast-with-string-lights-and-champagne-picture-id1298329918?k=20&m=1298329918&s=612x612&w=0&h=SJjCxNQqYZkXGryXlSCUKfs4mKF8-CzGgpLcNR82E0E=" />
          <MenuCard bg="info" text="My Bar" onClick={mybarRoute} img="https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/05/22/13/gin-cocktails.jpg?width=1200"/>
          <MenuCard bg="success" text="I'm Feeling Lucky" img="https://image.freepik.com/free-photo/smiling-barman-pouring-fresh-drink-with-blue-liquor-from-shaker-into-glass-using-strainer_130488-2027.jpg"/>
        </div>
      </div>
    </div>
  );
};

export default Home;
