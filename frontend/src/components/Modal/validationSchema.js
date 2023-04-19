import * as Yup from 'yup';

export default (channelsNames) => Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, 'modals.min')
    .max(20, 'modals.max')
    .notOneOf(channelsNames, 'modals.uniq')
    .required('modals.required'),
});
