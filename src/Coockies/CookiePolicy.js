import React, { Component } from "react";
import Cookies from "js-cookie";
import  './styles.css';


const ConditionalWrapper=({condition,wrapper, children})=>{
    return condition ? wrapper(children):children;
}

export const OPTIONS = {
  TOP: "top",
  BOTTOM: "bottom",
  NONE: "none",
};

export const SAME_SITE_OPTIONS = {
  STRICT: "strict",
  LAX: "lax",
  NONE: "none",
};

const getLegacyCookieName = (name) => {
  return `${name}-legacy`;
};

const defaultCookieConsentName = "CookieConsent";

export const getCookieConsentValue = (name = defaultCookieConsentName) => {
  let cookieValue = Cookies.get(name);

  // if the cookieValue is undefined check for the legacy cookie
  if (cookieValue === undefined) {
    cookieValue = Cookies.get(getLegacyCookieName(name));
  }
  return cookieValue;
};


class CookieConsent extends Component{

   constructor(props){
     super(props);
     this.state={
       visible:false
     }
   }

    componentDidMount(){
        const {debug} = this.props

        if(this.getCookieValue()===undefined|| debug){
            this.setState({visible:true});
        }
    }

    accept(){
        const{cookieName,cookieValue,hideOnAccept,onAccept}=this.props;

        this.setCookie(cookieName,cookieValue);

        onAccept();

        if(hideOnAccept){
            this.setState({visible:false});
        }
    }

    decline(){
        const{cookieName,declineCookieValue,hideOnDecline, onDecline,setDeclineCookie}=this.props;

        if(setDeclineCookie){
            this.setCookie(cookieName,declineCookieValue);
        }

        onDecline();

        if(hideOnDecline){
            this.setState({visible:false});
        }
    }


    setCookie(cookieName,cookieValue){
        const{extraCookieOptions,expires,sameSite}=this.props;
        let {cookieSecurity}=this.props;

        if(cookieSecurity==undefined){
            cookieSecurity=window.location? window.location.protocol==='https':true;
        }

        let cookieOptions={expires, ...extraCookieOptions,sameSite,secure:cookieSecurity};

        if(sameSite===SAME_SITE_OPTIONS.NONE){
            Cookies.set(getLegacyCookieName(cookieName),cookieValue,cookieOptions);
        }

        Cookies.set(cookieName,cookieValue,cookieOptions);
    }

    getCookieValue(){
        const{cookieName}=this.props;
        return getCookieConsentValue(cookieName);
    }


    render(){
        if(!this.state.visible){
          console.log('Entrou');  
          return null;
            
        }

        const {
            flipButtons,
            ButtonComponent,
            overlay,

        } = this.props;

          
        const buttonsToRender=[];
    
         
         buttonsToRender.push(
            <button
              key="acceptButton"
              className="buttonStyle"
              aria-label='Accept'
              onClick={() => {
                this.accept();
              }}
            >
              Continuar e fechar
            </button>
          );

          if (flipButtons) {
            buttonsToRender.reverse();
          }
      
        return (
            <ConditionalWrapper>
              <div className="mainCookieContent">
                <div className="content">
                <div  className="contentStyle">
                  <h5 className="title">Mundo Pet e os cookies:</h5>
                  <p className="text">Utilizamos cookies para otimizar as funcionalidades, personalizar anuncios e melhorar a sua experiência no site. Saiba mais em nossa: </p>
                  <p className='text'><a  href="" className="text">Política de Privacidade</a> </p>
                </div>
                <div className="style">
                  {buttonsToRender.map((button) => {
                    return button;
                  })}
                </div>
                </div>
               
              </div>
            </ConditionalWrapper>
          );
    }
  
    
}

CookieConsent.defaultProps = {
  disableStyles: false,
  hideOnAccept: true,
  hideOnDecline: true,
  location: OPTIONS.BOTTOM,
  onAccept: () => {},
  onDecline: () => {},
  cookieName: defaultCookieConsentName,
  cookieValue: true,
  declineCookieValue: false,
  setDeclineCookie: true,
  buttonText: "I understand",
  declineButtonText: "I decline",
  debug: false,
  expires: 365,
  containerClasses: "CookieConsent",
  contentClasses: "",
  buttonClasses: "",
  buttonWrapperClasses: "",
  declineButtonClasses: "",
  buttonId: "rcc-confirm-button",
  declineButtonId: "rcc-decline-button",
  extraCookieOptions: {},
  disableButtonStyles: false,
  enableDeclineButton: false,
  flipButtons: false,
  sameSite: SAME_SITE_OPTIONS.LAX,
  ButtonComponent: ({ children, ...props }) => <button {...props}>{children}</button>,
  overlay: false,
  overlayClasses: "",
  ariaAcceptLabel: "Accept cookies",
  ariaDeclineLabel: "Decline cookies",
};
export default CookieConsent;