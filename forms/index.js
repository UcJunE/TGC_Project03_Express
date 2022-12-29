const forms = require("forms");
const { trigger } = require("../bookshelf");
const { Jewelry } = require("../models");

//setup forms
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

// all field will be validated
const options = {
  validatePastFirstError: true,
};

// Allow of styling of forms using Bootstrap
const bootstrapField = function (name, object) {
  if (!Array.isArray(object.widget.classes)) {
    object.widget.classes = [];
  }

  // Additional condition for allowing multiple checkbox and radio
  if (
    object.widget.type == "multipleCheckbox" ||
    object.widget.type == "multipleRadio"
  ) {
    object.widget.classes.push("form-check-input");
  } else {
    if (object.widget.classes.indexOf("form-control") === -1) {
      object.widget.classes.push("form-control");
    }
  }

  var validationclass = object.value && !object.error ? "is-valid" : "";
  validationclass = object.error ? "is-invalid" : validationclass;
  if (validationclass) {
    object.widget.classes.push(validationclass);
  }

  var label = object.labelHTML(name);
  var error = object.error
    ? '<div class="invalid-feedback">' + object.error + "</div>"
    : "";

  var widget = object.widget.toHTML(name, object);
  return '<div class="form-group">' + label + widget + error + "</div>";
};

//create form
const createProductForm = (colors, materials) => {
  return forms.create({
    name: fields.string({
      label: "Product Name",
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    description: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    cost: fields.number({
      label: "Cost (cents)",
      required: true,
      errorAfterField: true,
      validators: [validators.integer(), validators.min(0)],
      cssClasses: {
        label: ["form-label"],
      },
    }),
    design: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    color_id: fields.string({
      label: "Color",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: colors,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    materials: fields.string({
      label: "Material",
      required: true,
      errorAfterField: true,
      widget: widgets.multipleSelect(),
      choices: materials,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    weight: fields.number({
      label: "Weight (g)",
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer(), validators.min(0)],
    }),
    width: fields.number({
      label: "Width (mm)",
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer(), validators.min(0)],
    }),
    height: fields.number({
      label: "Height (mm)",
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer(), validators.min(0)],
    }),
    stock: fields.number({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer(), validators.min(0)],
    }),
    created_date: fields.date({
      widget: widgets.hidden(),
    }),
    jewelry_img_url: fields.url({
      required: validators.required("Product image is required"),
      errorAfterField: true,
      validators: [validators.url()],
      widget: widgets.hidden(),
    }),
    jewelry_thumbnail_url: fields.url({
      widget: widgets.hidden(),
    }),
  });
};

//creat user form
const createRegistrationForm = () => {
  return forms.create({
    name: fields.string({
      label: "Full Name",
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.maxlength(100)],
    }),
    username: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.maxlength(100)],
    }),
    email: fields.email({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.maxlength(255)],
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.maxlength(100)],
    }),
    confirm_password: fields.password({
      required: validators.required("Please re-enter password"),
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.matchField("password")],
    }),
    contact_number: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.tel(),
      validators: [validators.maxlength(15)],
    }),
    created_date: fields.date({
      widget: widgets.hidden(),
    }),
  });
};

//create login form
const createLoginForm = () => {
  return forms.create({
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
  });
};

//create search form
const createSearchForm = (jewelries = [], colors = [], materials = []) => {
  return forms.create({
    id: fields.string({
      label: "Product ID",
      required: false,
      errorAfterField: true,
      validators: [validators.integer()],
    }),
    name: fields.string({
      label: "Product Name",
      required: false,
      errorAfterField: true,
    }),
    color_id: fields.string({
      label: "Color",
      required: false,
      errorAfterField: true,
      widget: widgets.select(),
      choices: colors,
    }),
    materials: fields.string({
      label: "Material",
      required: false,
      errorAfterField: true,
      widget: widgets.multipleSelect(),
      choices: materials,
    }),
    design: fields.string({
      label: "Design",
      required: false,
      errorAfterField: true,
      widget: widgets.select(),
      choices: jewelries,
    }),
    min_cost: fields.string({
      label: "Minimum Cost ($)",
      required: false,
      errorAfterField: true,
      validators: [validators.integer()],
    }),
    max_cost: fields.string({
      label: "Maximum Cost ($)",
      required: false,
      errorAfterField: true,
      validators: [validators.integer()],
    }),
  });
};

module.exports = {
  createProductForm,
  createRegistrationForm,
  createLoginForm,
  createSearchForm,
  bootstrapField,
};
