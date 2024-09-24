import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";

import SaleDetailsPage from "../SaleDetailsPage/SaleDetailsPage";
import { Calendar } from 'primereact/calendar';

const SingleBookDetailsPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [authorName, setAuthorName] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("bookDetails")
            .get(urlParams.singleBookDetailsId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"authorName"] }})
            .then((res) => {
                set_entity(res || {});
                const authorName = Array.isArray(res.authorName)
            ? res.authorName.map((elem) => ({ _id: elem._id, authorName: elem.authorName }))
            : res.authorName
                ? [{ _id: res.authorName._id, authorName: res.authorName.authorName }]
                : [];
        setAuthorName(authorName);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "BookDetails", type: "error", message: error.message || "Failed get bookDetails" });
            });
    }, [props,urlParams.singleBookDetailsId]);


    const goBack = () => {
        navigate("/bookDetails");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">BookDetails</h3>
                </div>
                <p>bookDetails/{urlParams.singleBookDetailsId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">BookName</label><p className="m-0 ml-3" >{_entity?.bookName}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">PublicationDate</label><p id="publicationDate" className="m-0 ml-3" >{_entity?.publicationDate}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Price</label><p className="m-0 ml-3" >{Number(_entity?.price)}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">QuantityInStock</label><p className="m-0 ml-3" >{Number(_entity?.quantityInStock)}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">AuthorName</label>
                    {authorName.map((elem) => (
                        <Link key={elem._id} to={`/authorDetails/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.authorName}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        <SaleDetailsPage/>
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

export default connect(mapState, mapDispatch)(SingleBookDetailsPage);
