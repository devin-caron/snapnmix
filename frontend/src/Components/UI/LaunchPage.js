import "./LaunchPage.css";
import Button from "react-bootstrap/Button";

const LaunchPage = (props) => {
  const launchPageHandler = () => {
    console.log("click");
  };

  if (props.visible === "false") {
    return;
  } else {
    return (
      <div className="launchContainer">
        <div className="launchTitles">
        <img className="loginBrand" src="SnapAndMixLogo.png"></img>

          <div class="ageVeificationDiv">
            <h2>Age Verification</h2>
            <p>
              By clicking enter, you certify that you are of legal drinking age in the
              state / province in which you currently reside.
            </p>

            <Button variant="customEnter" onClick={props.handler}>
            ENTER
            </Button>

            <p class="decor-line">
              <span>Or</span>
            </p>

            <Button variant="customLeave" onclick="javascript:window.close()">
            LEAVE
            </Button>

            <small>Always enjoy responsibly</small>
          </div>
        </div>
        <div className="developerSignature">
        <p className="developedbyText">Developed By</p>
        <img className="companyBrand" src="Scan5Logo.png"></img>
      </div>
        {/* <img src="https://thewinesisters.com/wp-content/uploads/2013/10/people-toasting-wine-glasses-3171837-min-1110x630.jpg"></img> */}
      </div>
    );
  }
};

export default LaunchPage;
