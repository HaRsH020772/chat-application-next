import React from 'react'

const Modal = ({setProfilePicture}:any) => {

    return (
        <>

            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box bg-slate-800">
                    <h3 className="font-bold text-lg">Did you want to use these avatar ??</h3>
                    <div className="modal-action">
                        <label htmlFor="my-modal" onClick={setProfilePicture} className="btn tracking-wider">Select</label>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Modal
