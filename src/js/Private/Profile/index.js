import React from 'react';
import { Typography, Button, CircularProgress, Divider } from '@material-ui/core'
import {
    IconButton,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { uploadFileToFirebase, getUserInfo, getUserid } from '../../services/storage';
import { updateUser } from '../../services/firebase';
import stars from '../../../assets/stars.png'
export default function Profile(props) {
    const inputRef = React.createRef();
    const goToEdit = () => {
        props.history.push(`/edit-profile/${getUserid()}`)
    }

    const [image, setImage] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);

    function handleImageChage(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        setUploading(true)
        reader.onloadend = async () => {
            const { success, res } = await uploadFileToFirebase(file)
            setUploading(false)
            setImage(reader.result)
            if (success) {
                await updateUser({ avatar: res.url })
            } else {
                console.log('error subiendo', res);
            }
        }
        reader.readAsDataURL(file)
    }

    const renderStars = () => {
        return (
            <div className="rating-container" >
                <img src={stars} alt="rating" />
            </div>)

    }

    return (
        <div className='profile-container'>
            <div className="left-side">
                <div className="image-container">
                    <img
                        className="profile-img"
                        alt="perfil"
                        src={image ? image : getUserInfo().avatar}
                    />
                    {uploading ? <CircularProgress className="progress" /> : null}

                </div>
                <input
                    className="input-pick-photo"
                    accept="image/png, image/jpeg"
                    type="file"
                    ref={inputRef}
                    onChange={handleImageChage}
                />
                <Button
                style={{marginBottom:10}}
                    className="button-change-image"
                    color="primary"
                    variant="contained"
                    onClick={() => inputRef.current.click()}
                >
                    Cambiar Foto
            </Button>

                <Typography variant="h5" style={{marginBottom:10}}>
                    E-mail {getUserInfo().email}
                </Typography>
                <Typography variant="h5" style={{marginBottom:10}}>
                    Teléfono XXXXX
                </Typography>
                <IconButton aria-label="edit" onClick={goToEdit}>
                    Modificar <Edit />
                </IconButton>

                <div className="info-container">
                    {renderStars()}
                    <Divider />
                    <Typography variant="h5">
                        Calificación
                     </Typography>
                    {renderStars()}
                    <Divider />
                    <Typography variant="h5">
                        Ex nisi occaecat minim et.
                     </Typography>
                    {renderStars()}
                    <Divider />
                    <Typography variant="h5">
                        Ut aute magna aute et magna laborum consequat.
                     </Typography>
                </div>
            </div>

            <div className="rigth-side">
                <Typography variant="h3" >Calificación y comentarios</Typography>
                <Typography variant="body1">
                    Deserunt veniam consectetur quis magna et ut cupidatat magna ex cupidatat irure non. Minim nulla et exercitation fugiat dolor pariatur consequat ullamco in laborum et culpa tempor. Ea Lorem sit officia non esse. Dolor et anim tempor occaecat qui qui in magna nisi cupidatat. Ullamco do voluptate proident eu ullamco sint excepteur in. Nulla mollit voluptate laborum do ipsum sunt est incididunt cillum occaecat nulla et irure.
               </Typography>

                <Divider className="divider" />
                <Typography variant="body1">
                    Deserunt veniam consectetur quis magna et ut cupidatat magna ex cupidatat irure non. Minim nulla et exercitation fugiat dolor pariatur consequat ullamco in laborum et culpa tempor. Ea Lorem sit officia non esse. Dolor et anim tempor occaecat qui qui in magna nisi cupidatat. Ullamco do voluptate proident eu ullamco sint excepteur in. Nulla mollit voluptate laborum do ipsum sunt est incididunt cillum occaecat nulla et irure.
               </Typography>
                <Divider className="divider" />

                <Typography variant="body1">
                    Deserunt veniam consectetur quis magna et ut cupidatat magna ex cupidatat irure non. Minim nulla et exercitation fugiat dolor pariatur consequat ullamco in laborum et culpa tempor. Ea Lorem sit officia non esse. Dolor et anim tempor occaecat qui qui in magna nisi cupidatat. Ullamco do voluptate proident eu ullamco sint excepteur in. Nulla mollit voluptate laborum do ipsum sunt est incididunt cillum occaecat nulla et irure.
               </Typography>
                <Divider className="divider" />

            </div>
            {/* <Typography variant="h3">
                Perfil
            </Typography>
            <div className="image-container">
                <img
                    className="profile-img"
                    alt="perfil"
                    src={image ? image : getUserInfo().avatar}
                />
                {uploading ? <CircularProgress className="progress" /> : null}

            </div>
            <Button
                color="primary"
                variant="contained"
                onClick={() => inputRef.current.click()}
            >
                Cambiar Foto
            </Button>

            <input
                accept="image/png, image/jpeg"
                type="file"
                ref={inputRef}
                onChange={handleImageChage}
            />


            <Typography variant="h3">
                {getUserInfo().email}
            </Typography>
            <IconButton aria-label="edit" onClick={goToEdit}>
               Modificar <Edit />
            </IconButton> */}
        </div>
    )
}