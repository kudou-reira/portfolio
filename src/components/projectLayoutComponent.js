import React, { Component } from 'react';
import {withRouter} from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Typography from '@material-ui/core/Typography';
import { requirePropFactory } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';


class ProjectLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: props.pathname,
            projectDetails: props.projectDetails,
            projectAll: props.projectAll,
            resourcePath: props.resourcePath,
            overview: '',
            final: '',
            background: '',
            process: '',
            wip: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps !== undefined) {
            if (this.state.pathname !== nextProps.pathname) {
                this.setState({
                    pathname: nextProps.pathname, 
                    projectAll: nextProps.projectAll, 
                    projectDetails: nextProps.projectDetails,
                    resourcePath: nextProps.resourcePath
                });
                console.log("true");
            }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.pathname !== this.state.pathname) {
            let { projectDetails, pathname } = this.state;

            let fetchPoints = [];

            projectDetails.map((obj, index) => {
                // console.log("this is obj", obj);

                let mdFile = '';
                let folderPath = obj.folder_path;

                if(pathname === '') {
                    pathname = 'home';
                }

                mdFile = require("../portfolio_images/" + pathname + "/" + folderPath + "/" + folderPath + ".md");
                fetchPoints.push(mdFile);
                
                // build an array of fetches with mdFile as the endpoint
            });

            const files = await Promise.all(fetchPoints.map((file) => fetch(file). then((res) => res.text()))).catch((err) => console.error(err));
            
            this.setState({
                overview: files[0],
                final: files[1],
                background: files[2],
                process: files[3],
                wip: files[4]
            })
        }
    }

    async componentDidMount() {
        let { projectDetails, pathname } = this.state;
        let fetchPoints = [];

        projectDetails.map((obj, index) => {
            // console.log("this is obj", obj);

            let mdFile = '';
            let folderPath = obj.folder_path;

            if(pathname === '') {
                pathname = 'home';
            }

            console.log("this is pathname", pathname);

            mdFile = require("../portfolio_images/" + pathname + "/" + folderPath + "/" + folderPath + ".md");
            fetchPoints.push(mdFile);
            
            // build an array of fetches with mdFile as the endpoint
        });

        const files = await Promise.all(fetchPoints.map((file) => fetch(file). then((res) => res.text()))).catch((err) => console.error(err));
        
        this.setState({
            overview: files[0],
            final: files[1],
            background: files[2],
            process: files[3],
            wip: files[4]
        })

    }


    renderProjectLayoutDisplay() {
        return (
            // <ImageResults 
            //     database={this.state.database_id}
            // />
            <div>
                {this.renderText()}
            </div>
        )
    }

    checkFileFormat(files) {

    }


    renderDetails(detailPath, folderPath, projectAll) {
        let mdFile = '';

        if('final' in projectAll && folderPath === 'final') {
            console.log("there are resources to be rendered");

            this.checkFileFormat(projectAll[folderPath]);
        }

        mdFile = <ReactMarkdown source={this.state[folderPath]} />
        
        


        return mdFile;
    }

    renderText() {
        let textItems = [];
        let tempText = '';

        let { resourcePath, pathname, projectAll } = this.state;

        tempText = (
            <Typography variant="h2" gutterBottom>
                {projectAll.text}
            </Typography>
        );

        textItems.push(tempText);

        this.state.projectDetails.map((obj, index) => {
            tempText = (
                <Typography variant="h4" gutterBottom>
                    {obj.text}
                    <Typography gutterBottom>
                        {this.renderDetails(pathname  + "/" + obj.folder_path, obj.folder_path, projectAll)}
                    </Typography>
                </Typography>
            )

            textItems.push(tempText);
        });

        return textItems;
    }

    render() {
        return(
            <div>
                <div>
                    {this.renderProjectLayoutDisplay()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        results: state.upload
    };
}


export default connect(mapStateToProps, actions)(withRouter(ProjectLayout));
