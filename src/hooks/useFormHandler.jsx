import React from 'react';

const useFormHandler = ({formState = null, setFormState = null }) => {

    //Bind a field with this onChange handler
    const onChangeHandler = (e) => {
        const {name, value} = e.target;
        if(!name) {
            console.log(`FormHandler Error: field name is empty`);
            return;
        }
        if(name in formState === false) {
            //This field does not exist in state. 
            console.log(`FormHandler Error: Form State doesnt have a field named [${name}]`);
            return;
        }
        //Handle validation

        //Set state
        setFormState( currentState => {
            return {
                ...currentState,
                [name] : value
            }
        });
    }

    const setFieldState = (name, value) => {
        setFormState( currentState => {
            if( name in currentState === false) {
                return currentState;
            }
            return {
                ...currentState,
                [name] : value
            }
        });
    }

    const onSubmitHandler = (e, customHandler) => {
        e.preventDefault();

        customHandler(e);
    }


    return { onChangeHandler, setFieldState, onSubmitHandler}
}


export default useFormHandler;