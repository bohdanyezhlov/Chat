import { object, string } from 'yup';

export default (channelsNames: string[]) =>
  object().shape({
    name: string()
      .trim()
      .min(3, 'modals.min')
      .max(20, 'modals.max')
      .notOneOf(channelsNames, 'modals.uniq')
      .required('modals.required'),
  });
