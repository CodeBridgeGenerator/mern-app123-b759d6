import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import initilization from "../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const SaleDetailsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [bookName, setBookName] = useState([])

    useEffect(() => {
        let init  = {saleDate:new Date()};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [bookName], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.customerName)) {
                error["customerName"] = `CustomerName field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            bookName: _entity?.bookName?._id,customerName: _entity?.customerName,saleDate: _entity?.saleDate,quantitySold: _entity?.quantitySold,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("saleDetails").create(_data);
        const eagerResult = await client
            .service("saleDetails")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "bookName",
                    service : "bookDetails",
                    select:["bookName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info SaleDetails updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in SaleDetails" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount bookDetails
                    client
                        .service("bookDetails")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleBookDetailsId } })
                        .then((res) => {
                            setBookName(res.data.map((e) => { return { name: e['bookName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "BookDetails", type: "error", message: error.message || "Failed get bookDetails" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const bookNameOptions = bookName.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create SaleDetails" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="saleDetails-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="bookName">BookName:</label>
                <Dropdown id="bookName" value={_entity?.bookName?._id} optionLabel="name" optionValue="value" options={bookNameOptions} onChange={(e) => setValByKey("bookName", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["bookName"]) ? (
              <p className="m-0" key="error-bookName">
                {error["bookName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="customerName">CustomerName:</label>
                <InputText id="customerName" className="w-full mb-3 p-inputtext-sm" value={_entity?.customerName} onChange={(e) => setValByKey("customerName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["customerName"]) ? (
              <p className="m-0" key="error-customerName">
                {error["customerName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="saleDate">SaleDate:</label>
                <Calendar id="saleDate" value={_entity?.saleDate ? new Date(_entity?.saleDate) : new Date()} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("saleDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["saleDate"]) ? (
              <p className="m-0" key="error-saleDate">
                {error["saleDate"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="quantitySold">QuantitySold:</label>
                <InputNumber id="quantitySold" className="w-full mb-3 p-inputtext-sm" value={_entity?.quantitySold} onChange={(e) => setValByKey("quantitySold", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["quantitySold"]) ? (
              <p className="m-0" key="error-quantitySold">
                {error["quantitySold"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SaleDetailsCreateDialogComponent);
