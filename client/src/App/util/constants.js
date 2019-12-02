import React, {Component, Fragment} from 'react';
import {notification, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

import {getUserBrief, getEventBrief, getOrganizationBrief, search} from './APIUtils';
import {Link} from 'react-router-dom';
import Avatar from 'react-avatar-edit';
 
import UserPic from '../assets/defaultIcons/user.svg';
import EventPic from '../assets/defaultIcons/event.svg';
import OrganizationPic from '../assets/defaultIcons/organization.svg';
import AddPic from '../assets/defaultIcons/add.svg';
import SearchPic from '../assets/defaultIcons/search.svg';
import SettingPic from '../assets/defaultIcons/setting.svg';
import RemovePic from '../assets/defaultIcons/remove.svg';
import UnknownPic from '../assets/defaultIcons/unknown.svg';
import {NewUserPic} from '../assets/defaultIcons/newuser.json';
import {NewEventPic} from '../assets/defaultIcons/newevent.json';
import {NewOrganizationPic} from '../assets/defaultIcons/neworganization.json';

import * as validate from './validate';
const { Option } = Select;

// Neccessary Data

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
export const ACCESS_TOKEN = 'accessToken';
export const APP_NAME = "SBCS Util";

// Component Routing - Validate

export const ValidateFirstName = validate.validateFirstName;
export const ValidateLastName = validate.validateLastName;
export const ValidateEmail = validate.validateEmail;
export const ValidateNickname = validate.validateNickname;
export const ValidatePassword = validate.validatePassword;
export const ValidateName = validate.validateName;
export const ValidateDesc = validate.validateDesc;

// Profile Components

export class GetProfImg extends Component {

    constructor(props) {
        super(props);
        this.type = this.props.type;
        this.className = this.props.className;
        this.alt = this.props.alt;
    }

    render() {
        if (this.props.pic === null || this.props.pic === "" || this.props.pic === undefined) {
            if (this.type === "event") {
                this.image = EventPic
            } else if (this.type === "organization") {
                this.image = OrganizationPic
            } else if (this.type === "user") {
                this.image = UserPic
            } else if (this.type === "add") {
                this.image = AddPic
            } else if (this.type === "search") {
                this.image = SearchPic
            } else if (this.type === "settings") {
                this.image = SettingPic
            } else if (this.type === "remove") {
                this.image = RemovePic
            } else if (this.type === "error") {
                this.image = RemovePic
            } else {
                this.image = UnknownPic
            }
        } else {
            this.image = this.props.pic
        }

        return (<img src={this.image} className={this.className} alt={this.alt}/>)
    }
};

export class MakeProfImg extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preview: null,
            src: null
        }

        this.type = this.props.type;
        this.className = this.props.className;

        if (this.props.pic === null || this.props.pic === "" || this.props.pic === undefined) {
            if (this.type === "event") {
                this.state.src = NewEventPic
            } else if (this.type === "organization") {
                this.state.src = NewOrganizationPic
            } else {
                this.state.src = NewUserPic
            }
        } else {
            this.state.src = (this.props.pic);
        }

        this.onCrop = this
            .onCrop
            .bind(this)
        this.onClose = this
            .onClose
            .bind(this)
        this.onBeforeFileLoad = this
            .onBeforeFileLoad
            .bind(this)
        this.onImageLoad = this
            .onImageLoad
            .bind(this)
    }

    onClose() {
        this.setState({preview: null})
    }

    onCrop(preview) {
        this.setState({preview});
        if (preview != null) {
            this
                .props
                .data(preview);
        }
    }

    onImageLoad() {
        this.props.data(this.state.src);     
    }

    onBeforeFileLoad(elem) {
        if (elem.target.files[0].size > 71680) {
            notification["error"]({message: {APP_NAME}, description: "File is too big!"});
            elem.target.value = "";
        } else if (elem.target.files[0].type !== "image/png" && elem.target.files[0].type !== "image/jpeg") {
            notification["error"]({message: {APP_NAME}, description: "Only PNG + JPEG Allowed To Be Uploaded"});
            elem.target.value = "";
        };
    }

    render() {
        return (
            <div
                className={"makeProfPicEditor grid-x align-center-middle " + this.className}>
                <Avatar
                    width={360}
                    height={360}
                    cropRadius={180}
                    onCrop={this.onCrop}
                    onClose={this.onClose}
                    onImageLoad={this.onImageLoad}
                    onBeforeFileLoad={this.onBeforeFileLoad}
                    src={this.state.src}
                    className="editor-canvas cell"/>
            </div>
        )
    }
}

// ItemPreview Item [img,name,type,desc,id]
export const ItemPreview = ({items, className, type, postfix, postfixFunc}) => (
    <Fragment>
        {items.map(item => (<GetItem
            key={new Date().getMilliseconds() + (Math.random() * 69420)}
            type={type}
            item={item}
            postfix={postfix}
            postfixFunc={postfixFunc}
            className={"grid-x align-center-middle " + className}/>))}
    </Fragment>
);

class GetItem extends Component {

    constructor(props) {
        super(props);

        this.type = this.props.type;
        this.item = this.props.item;
        this.name = this.props.item.name;
        this.id = this.props.item.id;
        this.img = this.item.img;
        this.className = this.props.className;

        this.link = "/app/" + this.type + "/";
        this.descPre = "";
        this.desc = "";

        if (this.type === "user") {
            this.link = this.link + this.item.name;
        } else if (this.type === "event") {
            this.link = this.link + this.item.id;
            this.descPre = "Host:";
            this.desc = <span>{" " + this.item.host}</span>;
        } else if (this.type === "organization") {
            this.link = this.link + this.item.id;
        } else if (this.type === "action") {
            this.name = this.props.item;
            this.link = "#";
        } else if (this.type === "error") {
            this.link = "#";
        } else {
            this.link = this.link + this.item.id
            if (this.item.desc !== null && this.item.desc !== "") {
                this.descPre = "Desc:";
                this.desc = <span>{" " + this.item.desc}</span>;
            }
        }

        this.postfix = this.props.postfix;
        this.postfixFunc = this.props.postfixFunc;

        if (this.postfix === null || this.postfix === "" || this.postfix === undefined) {
            this.postfixClass = "hidden"
        } else {
            this.postfixClass = " ";
        }

        this.postFunc = this
            .postFunc
            .bind(this);

    }

    postFunc() {
        this.postfixFunc(this.item);
    }

    render() {
        return (
            <div className={this.className} key={this.id}>
                <Link
                    to={this.link}
                    className="previewItem small-11 grid-x align-center-middle cell">
                    <div className="small-5 grid-x cell">
                        <GetProfImg
                            className="small-10 cell"
                            pic={this.img}
                            alt={this.name}
                            type={this.type}/>
                    </div>
                    <div className="small-7 grid-x cell">
                        <div className="previewName cell">{this.name}</div>
                        <div className="previewDesc cell">{this.descPre}{this.desc}
                        </div>
                    </div>
                </Link>
                <div className="small-1 grid-x cell" onClick={this.postFunc}>
                    <GetProfImg
                        className={"small-6 cell " + this.postfixClass}
                        alt={this.postfix}
                        type={this.postfix}/>
                </div>
            </div>
        )
    }
};

// Dynamic Form

export class DynamicForm extends Component {

    state = {
        data: []
    };

    constructor(props) {
        super(props);

        this.state.data = this.props.data;

        this.onLoad = this.props.onLoad;
        this.type = this.props.type;
        this.className = this.props.className;

        this.customButtonData = <div />;
        
        if(this.props.customButtonData !== undefined){
            this.customButtonData = this.props.customButtonData;
        }

        this.addItem = this
            .addItem
            .bind(this);

        this.removeItem = this
            .removeItem
            .bind(this);
    }

    addItem(success, item) {
        // update the state object

        let hasItem = this
            .state
            .data
            .some(items => items['name'] === item.name);

        let passed = this.props.validate(item.name);

        if (success === true && hasItem === false && passed === true) {

            notification.success({message: {APP_NAME}, description: "Added!"});

            this
                .state
                .data
                .push(item);

            this.setState({data: this.state.data});
            this
                .props
                .onUpdate();

        } else {
            if (hasItem || passed === false) {
                notification.error({message: {APP_NAME}, description: "Already Added!"});
            } else {
                notification.error({message: {APP_NAME}, description: "Could not find that!"});
            }
        }

    }

    removeItem(item) {
        // update the state object
        const index = this
            .state
            .data
            .indexOf(item);

        if (index > -1) {
            this
                .state
                .data
                .splice(index, 1);
            this.setState({data: this.state.data});
            notification.success({message: {APP_NAME}, description: "Removed!"});
            this
            .props
            .onUpdate();
        } else {
            notification.error({message: {APP_NAME}, description: "Could not remove that!"});

        }

    }

    render() {
        return (
            <div className={"dynamicForm grid-x align-center-middle " + this.className}>
                <DynamicInput input="" addItem={this.addItem} type={this.type}/>
                <this.customButtonData />
                <ItemPreview
                    className="small-6 cell"
                    items={this.state.data}
                    type={this.type}
                    postfix="remove"
                    postfixFunc={this.removeItem}/>
            </div>
        )
    }
};

class DynamicInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            data: [],
            value: [],
            fetching: false
        }

        this.type = this.props.type;
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);

        if (this.type === "user") {
            this.state.textName = "Nickname";
        } else {
            this.state.textName = "Name";
        }

        this.handleInputChange = this
            .handleInputChange
            .bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue
            }
        });
    }

    render() {
        const { fetching, data, value } = this.state;
        return (
          <Select
            mode="multiple"
            labelInValue
            value={value}
            placeholder={"Select " +this.type}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={this.fetchUser}
            onChange={this.handleChange}
            className="searchbar cell"
          >
            {data.map(d => (
              <Option key={d.value}>{d.text}</Option>
            ))}
          </Select>
        );
    }

    fetchUser = value => {

        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;

        this.setState({ data: [], fetching: true });

        search(this.type,value)
          .then(response => {
            
            if (fetchId !== this.lastFetchId) {
              // for fetch callback order
              return;
            }
            
            var data;

            if(this.type === "user"){
                data = response.map(user => ({
                text: `${user.fullName}`,
                value: user.name,
                }));
            }else if(this.type === "organization"){
                data = response.map(organization => ({
                text: `${organization.name}`,
                value: organization.id,
                }));
            }else if(this.type === "event"){
                data = response.map(event => ({
                text: `${event.name} hosted by ${event.host}`,
                value: event.id,
                }));
            }

            this.setState({ data, fetching: false });
          });
      };
    
      handleChange = data => {
        
        const value = data[0].key;
        
        if(this.type === "user"){
            getUserBrief(value).then(response => {
                console.log(response)
                this.props.addItem(true, response);

                this.setState({
                    data: [],
                    fetching: false,
                  });
            })
        }else if(this.type === "organization"){ 
            getOrganizationBrief(value).then(response => {
                this.props.addItem(true, response);

                this.setState({
                    data: [],
                    fetching: false,
                  });
            })
        }else if(this.type === "event"){
            getEventBrief(value).then(response => {
                this.props.addItem(true, response);

                this.setState({
                    data: [],
                    fetching: false,
                  });
            })
        }

      };
}