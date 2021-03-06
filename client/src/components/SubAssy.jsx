import React, { Component } from 'react';
import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import Card from './common/Card';


class SubAssy extends Component {
    render() {
        return (
            <Card title={"Log Sub Assy Part"} col={12}>
                <div className="row align-items-center">
                    <div className="col-md-3 pr-md-1 mb-md-0 mb-2">
                        <label className="sr-only" htmlFor="search-dt">Cari</label>
                        <div className="input-with-icon">
                            <input type="text" className="form-control font-italic bg-grey focus" id="search-dt" placeholder="Cari..."></input>
                            <i><FontAwesomeIcon icon={faSearch} /></i>
                        </div>
                    </div>
                    <div className="col-md-3 p-md-1 mb-md-0 mb-2">
                        <Select
                            // value={selectedOption}
                            // onChange={this.handleChange}
                            options={[
                                { value: 'item1', label: 'Item Satu' },
                                { value: 'item2', label: 'Item Dua' },
                                { value: 'item3', label: 'Item Tiga' },
                            ]} />
                    </div>
                    
                    <div className="col-md-2 p-md-1 text-center text-md-left">
                        <button type="submit" className="btn btn-cc btn-cc-primary btn-cc-radius-normal ml-0 py-2 px-5 px-md-2"><FontAwesomeIcon icon={faSearch} />&ensp;Cari</button>
                    </div>
                    <div className="col-md-3 ml-md-auto text-center text-md-right">
                        <a href="/#" className="btn btn-cc btn-cc-primary btn-cc-radius-extra ml-0 py-2 px-5 px-md-2"><FontAwesomeIcon icon={faPlus} />&ensp;Tambah</a>
                    </div>
                </div>
                <table id="dt-news" className="table display" width="100%">
                    <thead>
                        <tr>
                            <th className="th-sm">
                                Code
                            </th>
                            <th className="th-sm">
                                Nama
                            </th>
                            <th className="th-sm">
                                Role
                            </th>
                            <th className="th-sm">
                                Created at
                            </th>
                            <th className="th-sm">
                                Updataed at
                            </th>
                        </tr>
                    </thead>
                </table>
            </Card>
        )
    }
}

export default SubAssy;
