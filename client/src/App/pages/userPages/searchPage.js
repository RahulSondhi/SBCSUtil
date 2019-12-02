import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import { Input, Select } from 'antd';
import Navbar from '../navbar/navbar.js';

import {ItemPreview} from '../../util/constants';

import {search} from '../../util/APIUtils'
import queryString from 'query-string'

const { Option } = Select;

export class SearchPage extends Component {

    id = 0;

    constructor(props) {
        super(props);

        this.state = {
            results: [],
            isLoading: true,
            type: "organization",
            defaultType: "organization",
            query: null,
            searchingClass: " ",
            searchClass: "hidden",
            searching: false,
            id: this.id
        }

        this.searching = this
            .searching
            .bind(this);

        this.updateType = this
            .updateType
            .bind(this);
        
        this.loadSearch = this
            .loadSearch
            .bind(this);
        
        this.exitSearch = this
            .exitSearch
            .bind(this);

    }

    updateType(val){
        this.setState({
            defaultType: val
        })
    }

    componentDidMount() {
        
        const values = queryString.parse(this.props.location.search)
        if(values.type !== undefined && values.query !== undefined ){
            this.setState({
                type: values.type,
                defaultType: values.type,
                query: values.query,
                id: this.id + 1
            });
            this.loadSearch();
        }else{
            this.setState({
                searchingClass: " ",
                searchClass: "hidden",
                isLoading: false
            });
        }

    }

    loadSearch = () => {

        this.id += 1;
        if(["organization","event"].includes(this.state.defaultType)){
            search(this.state.defaultType,this.state.query).then(response => {
                this.setState({
                    type: this.state.defaultType,
                    results: response,
                    isLoading: false,
                    searchingClass: "hidden",
                    searchClass: " ",
                    searching: true,
                    id: this.id
                });
            }).catch(error => {
                this.setState({
                    results: [{name:"No "+this.state.type+" called '"+ this.state.query +"' found!"}],
                    type: "error",
                    isLoading: false,
                    searchingClass: "hidden",
                    searchClass: " ",
                    searching: true,
                    id: this.id
                });
            });
        } else  {
            this.props.history.push({
                pathname: '/app/search',
                search: ""
            })
            window.location.reload();
        }

    }

    exitSearch = () => {
        this.setState({
            results: [],
            type: "",
            searchingClass: " ",
            searchClass: "hidden",
            searching: false,
            id: this.id,
        });
    }

    searching(e){

        this.props.history.push({
            pathname: '/app/search',
            search: '?type='+this.state.defaultType+"&query="+e.target.value
        })

        this.state.query = e.target.value;

        this.loadSearch()

    }

    render() {

        const selectBefore = (
            <Select defaultValue={this.state.defaultType} onChange={this.updateType}>
                <Option value="event">Event Name</Option>
                <Option value="organization">Organization Name</Option>
            </Select> 
        );

        // Checking if data came in
        if (this.state.isLoading) {
            return null
        }

        // Checking response
        if (this.state.serverError === true) {
            return <Redirect
                to={{
                pathname: "/app/error",
                state: {
                    from: this.props.location,
                    notFound: this.state.notFound,
                    serverError: this.state.serverError
                }
            }}/>
        }

        const values = queryString.parse(this.props.location.search)

        if(values.query === undefined && this.state.searching === true){
            this.exitSearch();
        }

        return (
            <div className="grid-x align-center-middle">
                
                <Navbar/>

                {/* Title */}
                <h1 id="searchTitle" className={"caption small-8 cell "+this.state.searchingClass}>
                    Search
                </h1>

                {/* Search Bar */}
                <Input addonBefore={selectBefore} className="searchbar medium-10 cell" placeholder="What are you looking for?" onPressEnter={(e) => this.searching(e)} />

                <ItemPreview
                    className= {"small-6 medium-3 cell "+this.state.searchClass}
                    items={this.state.results}
                    type={this.state.type}/>
                
            </div>
        )

    }
}

export default SearchPage;
