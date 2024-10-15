import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";

import { Rating } from 'primereact/rating';
import { Calendar } from 'primereact/calendar';

const SingleReviewDetailsPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    

    useEffect(() => {
        //on mount
        client
            .service("reviewDetails")
            .get(urlParams.singleReviewDetailsId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },] }})
            .then((res) => {
                set_entity(res || {});
                
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "ReviewDetails", type: "error", message: error.message || "Failed get reviewDetails" });
            });
    }, [props,urlParams.singleReviewDetailsId]);


    const goBack = () => {
        navigate("/reviewDetails");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">ReviewDetails</h3>
                </div>
                <p>reviewDetails/{urlParams.singleReviewDetailsId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">BookName</label><p className="m-0 ml-3" >{_entity?.bookName}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">UserName</label><p className="m-0 ml-3" >{_entity?.userName}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Rating</label><p className="m-0 ml-3" ><Rating id="rating" value={Number(_entity?.rating)} /></p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">ReviewText</label><p className="m-0 ml-3" >{_entity?.reviewText}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">CreatedAt</label><p id="createdAt" className="m-0 ml-3" >{_entity?.createdAt}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">IsApproved</label><p className="m-0 ml-3" ><i id="isApproved" className={`pi ${_entity?.isApproved?"pi-check": "pi-times"}`}  ></i></p></div>
            

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleReviewDetailsPage);
