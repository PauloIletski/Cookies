import React, { Component } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import Styles from './styles.css';

const ConditionalWrapper=({condition,wrapper, children})=>{
    return condition ? wrapper(children):children;
}

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
            this.set({visible:false});
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


    set(cookieName,cookieValue){
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
            return null;
        }

        const {
            flipButtons,
            ButtonComponent,
            overlay,

        } = this.props;

          
        const buttonsToRender=[];
    
         buttonsToRender.push(
            <ButtonComponent
            key="declineButton"
            className={Styles.declineButtonStyle}
            aria-label='decline'
            onClick={() => {
              this.decline();
            }}
          >
            "Decline"
          </ButtonComponent>
         )
         buttonsToRender.push(
            <ButtonComponent
              key="acceptButton"
              className={Styles.buttonStyle}
              aria-label='Accept'
              onClick={() => {
                this.accept();
              }}
            >
              "Accept"
            </ButtonComponent>
          );

          if (flipButtons) {
            buttonsToRender.reverse();
          }
      
        return (
            <ConditionalWrapper
              condition={overlay}
              wrapper={(children) => (
                <div className={Styles.overlayStyle}>
                  {children}
                </div>
              )}
            >
              <div className={Styles.style}>
                <div  className={Styles.contentStyle}>
                  {this.props.children}
                </div>
                <div className={Styles.buttonStyle}>
                  {buttonsToRender.map((button) => {
                    return button;
                  })}
                </div>
              </div>
            </ConditionalWrapper>
          );
    }

   
}

export default CookieConsent;