import { ResponseReportScheduleEntity } from "entities/reports";
import { FormikHelpers } from "formik";

export type TPropsUpdateSchedule = {
  freqy: string;
  invty1: string;
  invty2: string;
  invty3: string;
  time1: string;
  time2: string;
  time3: string;
};

export type TModalSchedule = {
  open: boolean;
  onClose: () => void;
  onUpdateSchedule: (
    props: TPropsUpdateSchedule,
    resetForm: FormikHelpers<TPropsUpdateSchedule>["resetForm"]
  ) => void;
  data: ResponseReportScheduleEntity;
};
