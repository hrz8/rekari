import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import Card from '../../common/Card';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import bwipjs from 'bwip-js';
import ReactToPrint from 'react-to-print';

class BarcodeToPrint extends Component {
    render() {
        return (
            <div className="m-5">
                <img src={this.props.src} alt="barcode"/>
            </div>
        );
    }
}

class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeParts: [],
            subPartsFromDb: [],
            barcodeDataUrl: "",
            // datasend/payload
            typePartId: null,
            total: 1,
            subPartsToSend: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeSubPart = this.handleChangeSubPart.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
    }

    generateUnique = () => {
        const length = 15;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
     }

    componentDidMount() {
        axios.post('http://localhost:3028/typepart')
            .then(response => {
                this.setState({
                    typeParts: response.data.message.map(
                        item => ({ value: item.id, label: item.name, ...item })
                    )
                });
            })
            .catch(err => console.log(err.response.data.message));
    }

    handleChangeSelect(selected) {
        let tempSubPartsToSend = [];
        selected.subParts.forEach(item => {
            tempSubPartsToSend.push({lotSubPartCode: "", subPartName: item.name});
        })
        this.setState({
            subPartsFromDb: selected.subParts,
            typePartId: selected.value,
            subPartsToSend: tempSubPartsToSend
        });
    }

    handleChangeSubPart(e) {
        // e.preventDefault();
        // console.log(e.target.value);
        let tempSubPartsToSendRaw = [ ...this.state.subPartsToSend ];
        tempSubPartsToSendRaw[e.target.dataset.index] = {
            lotSubPartCode: e.target.value,
            subPartName: this.state.subPartsToSend[e.target.dataset.index].subPartName
        };
        this.setState(
            { subPartsToSend: tempSubPartsToSendRaw }
        );
        const regex = /.*(.{7})=.*-BR0.*PC\s(\d+)\s{28,29}(.*)(\d{8})\s*\*/;
        if (regex.test(e.target.value)) {
            const catchGroup = regex.exec(e.target.value);
            let tempSubPartsToSend = [ ...this.state.subPartsToSend ];
            tempSubPartsToSend[e.target.dataset.index] = {
                lotSubPartCode: catchGroup[2] + "-" + catchGroup[4] + "-" + catchGroup[1] + "-" + catchGroup[3],
                subPartName: this.state.subPartsToSend[e.target.dataset.index].subPartName
            };
            this.setState(
                { subPartsToSend: tempSubPartsToSend }
            );
            try {
                document.getElementById("subPart" + (parseInt(e.target.dataset.index) + 1)).focus();
            }
            catch {
                document.getElementById("iNPerLot").focus();
            }
        }
    }

    handleChange(e) {
        if (e.target.name === "nSubPart" && e.target.value > 0) {
            this.setState({
                total: parseInt(e.target.value)
            });
        }
    }

    renderSubPart() {
        const subPartElem = (index, id, name) => (
            <div className="form-group" key={index}>
                <label>{name}</label>
                <input
                    id={"subPart" + index}
                    tabIndex="-1"
                    data-index={index}
                    data-idsubpart={id}
                    data-namesubpart={name}
                    onChange={this.handleChangeSubPart}
                    value={this.state.subPartsToSend[index].lotSubPartCode}
                    type="text"
                    className="form-control"
                    name="lotSubPartCode" />
            </div>
        );
        let subPartForm = [];
        this.state.subPartsFromDb.forEach((item, index) => {
            subPartForm.push(subPartElem(index, item.id, item.name));
        });
        return subPartForm;
    }

    isFormValid() {
        let nullSubPart = false;
        for (let i = 0; i < this.state.subPartsFromDb.length; i++) {
            if (this.state.subPartsToSend[i].lotSubPartCode === "") {
                nullSubPart = true;
                break;
            }
        }
        return this.state.typePartId && this.state.total > 0 && !nullSubPart;
    }

    async handleSubmit() {
        if (this.isFormValid()) {
            const generatedUnique = this.generateUnique();
            try {
                const newLog = await axios.post('http://localhost:3028/lotpart/add', {
                    lotpartBarcode: generatedUnique,
                    total: this.state.total,
                    operatorId: this.props.auth.id,
                    typePartId: this.state.typePartId,
                    lotPartsLotSubParts: this.state.subPartsToSend
                });
                if (newLog.data.message.id) {
                    try {
                        const canvasBarcode = document.createElement('canvas');
                        const options = { bcid: 'qrcode', text: generatedUnique, scale: 4 }
                        bwipjs.toCanvas(canvasBarcode, options);
                        this.setState({
                            barcodeDataUrl: canvasBarcode.toDataURL('image/png')
                        }, () => {
                            const resetSubPartsToSend = this.state.subPartsToSend.map(obj => ({...obj, lotSubPartCode: ""}));
                            this.setState({
                                subPartsToSend: resetSubPartsToSend
                            });
                            document.getElementById("subPart0").focus();

                        })
                    }
                    catch(e) {
                        console.log(e);
                    }
                }
            }
            catch(err) {
                console.log(err.response.data.message);
            }
        }
        else {
            alert("Form tidak boleh kosong/salah.");
        }
    }

    render() {
        return (
            <Card title="Tambah Data Log" col={6}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    noValidate>
                    <div className="form-group">
                        <label htmlFor="iTipe">Tipe Part</label>
                        <Select
                            id="iTipe"
                            placeholder="Pilih Tipe Part"
                            onChange={this.handleChangeSelect}
                            options={this.state.typeParts}
                            />
                    </div>
                    <div className="ml-5">
                        {this.renderSubPart().map(component => {
                            return component;
                        })}
                    </div>
                    <div className="form-group">
                        <label htmlFor="iNPerLot">Jumlah per Lot</label>
                        <input
                            id="iNPerLot"
                            type="number"
                            className="form-control"
                            name="nSubPart"
                            value={this.state.total}
                            onChange={this.handleChange}
                            />
                    </div>
                    
                    <div className="d-flex">
                        <Link to="/dashboard/work-subassy"
                            className="btn btn-cc btn-cc-white btn-cc-radius-normal ml-0 py-2 px-5">
                            <i><FontAwesomeIcon icon={faArrowLeft} /></i>&nbsp;Semua
                        </Link>
                        <ReactToPrint
                            trigger={() => <button
                                type="submit"
                                disabled={!this.isFormValid()}
                                className="ml-auto btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5">
                                <i><FontAwesomeIcon icon={faPlusSquare} /></i>&nbsp;Tambahkan
                            </button>}
                            content={() => this.componentRef}
                            onBeforeGetContent={() => this.handleSubmit()}
                        />
                        <div style={{ display: "none" }}>
                            <BarcodeToPrint src={this.state.barcodeDataUrl} ref={el => (this.componentRef = el)} />
                        </div>
                    </div>
                </form>
            </Card>
        )
    }
}

const mapState = (state) => ({
    auth: state.auth
});

export default connect(mapState)(Add);
