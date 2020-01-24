import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { View } from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
} from 'react-native-elements';


class Form extends Component {

  renderField(data) {
    const hasError = data.meta.touched && !!data.meta.error;
    data.input.value = data.input.value.toString();
    return (
      <View>
        <FormLabel labelStyle={ {color: 'gray', fontSize: 20} }>
            {data.input.name}
        </FormLabel>
        <FormInput containerStyle={ {flexDirection:'row'} }
                   inputStyle={ {color: 'black', flex:1} }
                   {...data.input}
                   step={data.step}
                   required={data.required}
                   placeholder={data.placeholder}
                   id={`book_${data.input.name}`}
                   multiline={true}
                   keyboardType='numeric'
        />
        {hasError &&
          <FormValidationMessage>{data.meta.error}</FormValidationMessage> }
      </View>
    );
  }

  render() {
    const {handleSubmit, mySubmit} = this.props;

    return (
      <View style={ {backgroundColor: 'white', paddingBottom: 20} }>
        <Field component={this.renderField} name="isbn" type="text"
          placeholder="The ISBN of the book" />
        <Field component={this.renderField} name="title" type="text"
          placeholder="The title of the book" required={true} />
        <Field component={this.renderField} name="description" type="text"
          placeholder="A description of the item" required={true} />
        <Field component={this.renderField} name="author" type="text"
          placeholder="The author of this content or rating. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably" required={true} />
        <Field component={this.renderField} name="publicationDate" type="dateTime"
          placeholder="The date on which the CreativeWork was created or the item was added to a DataFeed" required={true} />
        <Field component={this.renderField} name="reviews" type="text"
          placeholder="The book's reviews" />
        <Button buttonStyle={styles.button}
          title='SAVE'
          onPress={handleSubmit(mySubmit)}
        />
      </View>
    );
  }
}

const styles = {
  button: {
    flex: 1,
    backgroundColor: '#3faab4',
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'transparent',
    width: 300,
    height: 50,
    margin: 20,
  },
  placeholderStyle:{
    paddingRight:10
  }
};

export default reduxForm(
    {
      form: 'book',
      enableReinitialize: true, keepDirtyOnReinitialize: true,
    })(
    Form);
