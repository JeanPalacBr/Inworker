import React from 'react';
import { TextField, Button } from '@material-ui/core'
import queryString from 'query-string';

import { getUserById, updateUserById, changeEmail } from '../../services/firebase';
import { getToken } from '../../services/storage';

class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            name: ''
        }
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        const { success, res } = await getUserById(id)

        if (success) {
            this.setState({
                email: res.email,
                name: res.name
            })
        }
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };
    onSubmit = async (event) => {
        event.preventDefault();
        const { id } = this.props.match.params;
        const { name, email } = this.state;
        const {  success } = await updateUserById(id, { name, email })
        if (success) {
            changeEmail({ email, id: getToken() })
            alert("Actualización completa")
        } else {
            alert("No se pudo actualizar intente mas tarde")
        }

    }
    render() {
        const { email, name } = this.state;
        return (
            <form className="user-edit-container" onSubmit={this.onSubmit}>
                <TextField
                    variant="outlined"
                    value={name}
                    label="Nombre"
                    onChange={this.handleChange('name')}
                />
                <TextField
                    variant="outlined"
                    value={email}
                    label="Correo"
                    onChange={this.handleChange('email')}
                />
                <Button
                    color="primary"
                    variant="contained"
                    type="submit">Guardar</Button>
            </form>
        )
    }
}
export default EditProfile;