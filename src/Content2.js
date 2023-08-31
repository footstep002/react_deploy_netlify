import React from 'react'
import ItemList from './ItemList';

//import {FaTrashAlt} from 'react-icons/fa';

const Content2 = ({ items, handleCheck, handleDelete}) => {

    return (
        <>
            {items.length ? (
                <ItemList
                    items={items}
                    handleCheck={handleCheck}
                    handleDelete={handleDelete}>

                </ItemList>
                ):(
                    <p style={{marginTop:'2rem'}}>
                        your list is empty
                    </p>
                )}
        </>
    )
}

export default Content2