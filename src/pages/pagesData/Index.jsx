import React, { useState } from 'react'
import { useEffect } from 'react';
import RichTextEditor from 'react-rte';
import { Button } from 'antd'
import { getExtra, setExtra } from '../../elements/api/other';
import { toast } from 'react-toastify';

export const PagesData = () => {
    const [collabrate, setcollabrate] = useState(RichTextEditor.createEmptyValue())
    const [terms, setterms] = useState(RichTextEditor.createEmptyValue())
    const [privacy, setprivacy] = useState(RichTextEditor.createEmptyValue())
    const [contact, setcontact] = useState(RichTextEditor.createEmptyValue())

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        let res = await getExtra();
        if (res.status !== "0") {
            let { collabrate, terms, privacy, contact } = res.data[0];
            setcollabrate(RichTextEditor.createValueFromString(collabrate, 'html'))
            setterms(RichTextEditor.createValueFromString(terms, 'html'))
            setprivacy(RichTextEditor.createValueFromString(privacy, 'html'))
            setcontact(RichTextEditor.createValueFromString(contact, 'html'))
            toast.success(res.msg);
        } else
            toast.error(res.msg);
    }

    const onSubmit = async () => {
        let res = await setExtra({
            id: 1, collabrate: collabrate.toString('html'), terms: terms.toString('html'),
            privacy: privacy.toString('html'), contact: contact.toString('html'), action:"UPDATE"
        })
        if (res.status !== "0") {
            init()
            toast.success(res.msg);
        } else
            toast.error(res.msg);
    }

    return (
        <div>
            <h1>Pages Data</h1>
            <div style={{ marginBottom: 20, marginTop: 30 }}>Collabrate</div>
            <RichTextEditor
                value={collabrate}
                onChange={(val) => setcollabrate(val)}
            />
            <div style={{ marginBottom: 20, marginTop: 30 }}>Terms and Condition</div>
            <RichTextEditor
                value={terms}
                onChange={(val) => setterms(val)}
            />
            <div style={{ marginBottom: 20, marginTop: 30 }}>Privacy Policy</div>
            <RichTextEditor
                value={privacy}
                onChange={(val) => setprivacy(val)}
            />
            <div style={{ marginBottom: 20, marginTop: 30 }}>Contact Us</div>
            <RichTextEditor
                value={contact}
                onChange={(val) => setcontact(val)}
            />
            <Button style={{marginTop:30}} type="primary" onClick={onSubmit}>Edit</Button>
        </div>
    )
}
