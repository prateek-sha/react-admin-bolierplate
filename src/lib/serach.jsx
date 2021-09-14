import React, { useCallback, useRef } from 'react';
import { Input, Table } from 'antd'
import { useState } from 'react';
import { useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { setMaster, setParent, setSubMaster } from '../elements/api/product';
import { responseHelper } from './response';
import { useDispatch } from 'react-redux';
import { setMasterAction, setParentAction, setSubMasteAction } from '../redux/actions/allData';

const type = 'DragableBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
    const ref = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: monitor => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: item => {
            moveRow(item.index, index);
        },
    });
    const [, drag] = useDrag({
        type,
        item: { index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));

    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ''}`}
            style={{ cursor: 'move', ...style }}
            {...restProps}
        />
    );
};
export const SearchableTable = ({ dataSource, columns, id, rowSelection }) => {

    const [filterTable, setFilterTable] = useState(null)
    const [baseData, setBaseData] = useState(dataSource)

    const dispatch = useDispatch()

    useEffect(() => {
        if (dataSource) setBaseData(dataSource)
    }, [dataSource])

    const search = e => {
        let value = e.target.value
        const filterTable = baseData.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(value.toLowerCase())
            )
        );
        setFilterTable(filterTable)
    };

    const components = {
        body: {
            row: DragableBodyRow,
        },
    };

    const swapData = async (firstID, secondID) => {

        const handleMaster = async () => {
            let res = await setMaster({ firstID, secondID, action: "SWAP" })
            responseHelper(res, () => dispatch(setMasterAction()))
        }

        const handleSubMaster = async () => {
            let res = await setSubMaster({ firstID, secondID, action: "SWAP" })
            responseHelper(res, () => dispatch(setSubMasteAction()))
        }
        const handleMain = async () => {
            let res = await setParent({ firstID, secondID, action: "SWAP" })
            responseHelper(res, () => dispatch(setParentAction()))
        }

        switch (id) {
            case "main":
                handleMain()
                break;
            case "master":
                handleMaster()
                break;
            case "subMaster":
                handleSubMaster()
                break;
            default:
                break;
        }
    }
    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = baseData[dragIndex];
            const hoverRow = baseData[hoverIndex]
            swapData(dragRow.id, hoverRow.id)
        },
        [baseData],
    );
    return (
        <div  >

            <Input
                // className="mb-5"
                style={{ marginBottom: 10 }}
                placeholder="Search by..."
                onChange={search}
            />
            <DndProvider backend={HTML5Backend}>

                <Table columns={columns} components={id && components} pagination={id ? false : true}
                    onRow={id ? (record, index) => ({
                        index,
                        moveRow,
                    }) : null}
                    dataSource={filterTable == null ? baseData : filterTable} rowSelection={rowSelection} />
            </DndProvider>

        </div>
    )

}
