import React from 'react';
import {
    FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton,
    EmailIcon, WhatsappIcon, TwitterIcon, FacebookIcon
} from 'react-share';

const ShareComponent = (props) => {
    const destination = props.destination;
    const tripSelectionUrl = props.tripSelectionUrl;
    const user = props.user;

    const CopyLinkSelect = () => {
        const tripSelectionUrl = document.getElementById('tripSelectionUrl');
        tripSelectionUrl.select();
        document.execCommand("copy");
        //alert("Copied the text: " + tripSelectionUrl.value);
    }

    return (
        <div >
            <div>
                <div className="btn">
                    <FacebookShareButton className="btn" url={tripSelectionUrl} quote={"Please select trip options for " + destination} >
                        <FacebookIcon size={40} round={true} />
                    </FacebookShareButton>
                    <h6>Facebook</h6>
                </div>
                <div className="btn">
                    <TwitterShareButton className="btn" hashtags={['trip poll']} title={"Please select trip options for " + destination} url={tripSelectionUrl} >
                        <TwitterIcon size={40} round={true} />
                    </TwitterShareButton>
                    <h6>Twitter</h6>
                </div>
                <div className="btn">
                    <EmailShareButton className="btn" url={tripSelectionUrl} subject={"Please select trip options for " + destination} body={"Hello\n\nWelcome to Trip Poll!\nPlease follow the link to select options\n" + tripSelectionUrl + "\n\nThank You\n" + user.userName}>
                        <EmailIcon size={40} round={true} />
                    </EmailShareButton>
                    <h6>Email</h6>
                </div>
                <div className="btn">
                    <WhatsappShareButton className="btn" url={tripSelectionUrl} title={"Please select trip options for " + destination}>
                        <WhatsappIcon size={40} round={true} />
                    </WhatsappShareButton>
                    <h6>WhatsApp</h6>
                </div>
            </div>
            <br /><br /><br />
            <div style={{ display: "inline-flex" }}>
                <input id="tripSelectionUrl" className="form-control inputPlace" defaultValue={tripSelectionUrl} readOnly />
                <button className="btn btn-light" onClick={CopyLinkSelect}> Copy Link</button>
            </div>
        </div>
    )
}
export default ShareComponent;