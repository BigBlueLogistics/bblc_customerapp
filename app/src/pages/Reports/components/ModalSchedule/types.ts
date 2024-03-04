import { FormikHelpers } from "formik";
import { ResponseReportScheduleEntity } from "entities/reports";
import { TValidationSchedule } from "./validationSchema";

export type TModalSchedule = {
  open: boolean;
  onClose: () => void;
  onUpdateSchedule: (
    props: TValidationSchedule,
    resetForm: FormikHelpers<TValidationSchedule>["resetForm"]
  ) => void;
  data: ResponseReportScheduleEntity;
};
