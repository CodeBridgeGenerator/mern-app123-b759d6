import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";

import { Calendar } from 'primereact/calendar';

const SingleSaleDetailsPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [bookName, setBookName] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("saleDetails")
            .get(urlParams.singleSaleDetailsId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"bookName"] }})
            .then((res) => {
                set_entity(res || {});
                const bookName = Array.isArray(res.bookName)
            ? res.bookName.map((elem) => ({ _id: elem._id, bookName: elem.bookName }))
            : res.bookName
                ? [{ _id: res.bookName._id, bookName: res.bookName.bookName }]
                : [];
        setBookName(bookName);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "SaleDetails", type: "error", message: error.message || "Failed get saleDetails" });
            });
    }, [props,urlParams.singleSaleDetailsId]);


    const goBack = () => {
        navigate("/saleDetails");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">SaleDetails</h3>
                </div>
                <p>saleDetails/{urlParams.singleSaleDetailsId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">CustomerName</label><p className="m-0 ml-3" >{_entity?.customerName}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">SaleDate</label><p id="saleDate" className="m-0 ml-3" >{_entity?.saleDate}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">QuantitySold</label><p className="m-0 ml-3" >{Number(_entity?.quantitySold)}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">BookName</label>
                    {bookName.map((elem) => (
                        <Link key={elem._id} to={`/bookDetails/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.bookName}</p>
                            </div>
                        </Link>
                    ))}</div>

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

export default connect(mapState, mapDispatch)(SingleSaleDetailsPage);
