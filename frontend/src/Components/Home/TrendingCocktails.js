import React from 'react'
import {Carousel} from 'react-bootstrap'

const TrendingCocktails = () =>{
    return(<Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.thecocktaildb.com/images/media/drink/hbkfsh1589574990.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Whiskey Sour</h3>
            <p>Submitted by Jaydan Z.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.thecocktaildb.com/images/media/drink/mrz9091589574515.jpg"
            alt="Second slide"
          />
      
          <Carousel.Caption>
            <h3>Daiquiri</h3>
            <p>Submitted by Taimoor S.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg"
            alt="Third slide"
          />
      
          <Carousel.Caption>
            <h3>Mojito</h3>
            <p>Submitted by Cole S.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>);
}

export default TrendingCocktails;
