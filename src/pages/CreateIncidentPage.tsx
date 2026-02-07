import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts';
import { useCreateIncident } from '@/hooks/mutations';
import { incidentReportFormSchema, type IncidentReportFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper component for form fields with error display
function FormField({
  label,
  error,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className={cn(error && 'text-destructive')}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Section card wrapper
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function CreateIncidentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const createIncident = useCreateIncident();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IncidentReportFormData>({
    resolver: zodResolver(incidentReportFormSchema) as any,
    defaultValues: {
      status: 'open',
      incidentType: '',
      reporterName: user?.name || '',
      reporterRole: user?.role || '',
      reporterDepartment: user?.department || '',
      reportDateTime: new Date().toISOString().slice(0, 16),
      incidentClassification: 'abnormal',
      participantClassification: 'no_participant',
      incidentDateTime: '',
      incidentDepartment: 'emergency',
      incidentLocation: '',
      incidentDescription: '',
      incidentAttendees: [],
      incidentFindings: '',
      incidentHandling: {
        reportedTo: [],
        doctorPrognosis: {
          doctorWasCalled: false,
        },
      },
    },
  });

  // Watch values for conditional rendering
  const participantClassification = watch('participantClassification');
  const doctorWasCalled = watch('incidentHandling.doctorPrognosis.doctorWasCalled');
  const hospitalizedStatus = watch('participantDetails.hospitalizedStatus');

  // Patient classifications that require initial diagnosis
  const isPatient = ['ambulatory_patient', 'hospitalized_patient', 'er_patient'].includes(
    participantClassification
  );
  const hasParticipant = participantClassification !== 'no_participant';

  const onSubmit = async (data: IncidentReportFormData) => {
    try {
      // Transform form data to match the API input type
      const inputData = {
        ...data,
        incidentHandling: data.incidentHandling ? {
          reportedTo: data.incidentHandling.reportedTo || [],
          doctorPrognosis: data.incidentHandling.doctorPrognosis,
        } : undefined,
      } as any;
      
      const incident = await createIncident.mutateAsync(inputData);
      toast.success(t('common.save'));
      navigate(`/incidents/${incident.id}`);
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  // Incident types
  const incidentTypes = ['medical', 'safety', 'security', 'equipment', 'other'];

  // Departments
  const departments = ['emergency', 'general', 'pediatrics', 'surgery', 'ambulatory', 'other'];

  // Participant classifications
  const participantOptions = [
    { value: 'visitor', label: t('form.participant.visitor') },
    { value: 'ambulatory_patient', label: t('form.participant.ambulatoryPatient') },
    { value: 'hospitalized_patient', label: t('form.participant.hospitalizedPatient') },
    { value: 'er_patient', label: t('form.participant.erPatient') },
    { value: 'employee', label: t('form.participant.employee') },
    { value: 'no_participant', label: t('form.participant.noParticipant') },
    { value: 'other', label: t('form.participant.other') },
  ];

  // Reported to options
  const reportedToOptions = [
    'supervisor',
    'general_supervisor',
    'shift_manager',
    'epidemiologist_nurse',
    'maintenance',
    'it',
    'guardian',
    'security',
    'police',
    'bio_engineer',
    'hospital_management',
    'nursing_administration',
    'administrative_manager',
    'department_manager',
    'healthcare_facilities_supervisor',
    'family',
    'doctor_on_call',
    'active_doctor',
    'clinical_pharmacist',
    'other',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/incidents')}>
          <ArrowLeft className="size-4" />
          <span className="sr-only">{t('common.back')}</span>
        </Button>
        <h1 className="text-2xl font-bold">{t('incidents.createIncident')}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Status & Type */}
        <FormSection title={t('form.status.title')}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label={t('form.status.title')} required error={errors.status?.message}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="open" id="status-open" />
                      <Label htmlFor="status-open">{t('form.status.open')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="waiting_for_approval" id="status-waiting" />
                      <Label htmlFor="status-waiting">{t('form.status.waitingForApproval')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="closed" id="status-closed" />
                      <Label htmlFor="status-closed">{t('form.status.closed')}</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </FormField>

            <FormField
              label={t('form.incidentType.title')}
              required
              error={errors.incidentType?.message}
            >
              <Controller
                name="incidentType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.incidentType.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`form.incidentType.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Section 2: Reporter Details */}
        <FormSection title={t('form.details.title')}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label={t('form.details.reporterName')}
              required
              error={errors.reporterName?.message}
            >
              <Input {...register('reporterName')} readOnly className="bg-muted" />
            </FormField>
            <FormField
              label={t('form.details.reporterRole')}
              required
              error={errors.reporterRole?.message}
            >
              <Input {...register('reporterRole')} readOnly className="bg-muted" />
            </FormField>
            <FormField
              label={t('form.details.reporterDepartment')}
              required
              error={errors.reporterDepartment?.message}
            >
              <Input {...register('reporterDepartment')} readOnly className="bg-muted" />
            </FormField>
            <FormField
              label={t('form.details.reportDateTime')}
              required
              error={errors.reportDateTime?.message}
            >
              <Input type="datetime-local" {...register('reportDateTime')} />
            </FormField>
          </div>
        </FormSection>

        {/* Section 3: Incident Classification */}
        <FormSection title={t('form.classification.title')}>
          <FormField
            label={t('form.classification.title')}
            required
            error={errors.incidentClassification?.message}
          >
            <Controller
              name="incidentClassification"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="abnormal" id="class-abnormal" />
                    <Label htmlFor="class-abnormal">{t('form.classification.abnormal')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="almost" id="class-almost" />
                    <Label htmlFor="class-almost">{t('form.classification.almost')}</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </FormField>
        </FormSection>

        {/* Section 4: Participant Classification */}
        <FormSection title={t('form.participant.title')}>
          <FormField
            label={t('form.participant.title')}
            required
            error={errors.participantClassification?.message}
          >
            <Controller
              name="participantClassification"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-2 md:grid-cols-2"
                >
                  {participantOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`part-${option.value}`} />
                      <Label htmlFor={`part-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </FormField>
        </FormSection>

        {/* Section 5: Participant Details (conditional) */}
        {hasParticipant && (
          <FormSection title={t('form.participantDetails.title')}>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                label={t('form.participantDetails.firstName')}
                required
                error={errors.participantDetails?.firstName?.message}
              >
                <Input {...register('participantDetails.firstName')} />
              </FormField>
              <FormField
                label={t('form.participantDetails.lastName')}
                required
                error={errors.participantDetails?.lastName?.message}
              >
                <Input {...register('participantDetails.lastName')} />
              </FormField>
              <FormField
                label={t('form.participantDetails.idNumber')}
                required
                error={errors.participantDetails?.idNumber?.message}
              >
                <Input {...register('participantDetails.idNumber')} />
              </FormField>
              <FormField
                label={t('form.participantDetails.birthYear')}
                required
                error={errors.participantDetails?.birthYear?.message}
              >
                <Input type="number" {...register('participantDetails.birthYear')} />
              </FormField>
              <FormField
                label={t('form.participantDetails.gender')}
                required
                error={errors.participantDetails?.gender?.message}
              >
                <Controller
                  name="participantDetails.gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('form.participantDetails.male')}</SelectItem>
                        <SelectItem value="female">{t('form.participantDetails.female')}</SelectItem>
                        <SelectItem value="other">{t('form.participantDetails.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField
                label={t('form.participantDetails.hospitalizedStatus')}
                required
                error={errors.participantDetails?.hospitalizedStatus?.message}
              >
                <Controller
                  name="participantDetails.hospitalizedStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">{t('common.yes')}</SelectItem>
                        <SelectItem value="no">{t('common.no')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              {hospitalizedStatus === 'yes' && (
                <FormField
                  label={t('form.participantDetails.hospitalizedDateTime')}
                  error={errors.participantDetails?.hospitalizedDateTime?.message}
                >
                  <Input
                    type="datetime-local"
                    {...register('participantDetails.hospitalizedDateTime')}
                  />
                </FormField>
              )}
            </div>
          </FormSection>
        )}

        {/* Section 6: Incident Details */}
        <FormSection title={t('form.incidentDetails.title')}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label={t('form.incidentDetails.dateTime')}
              required
              error={errors.incidentDateTime?.message}
            >
              <Input type="datetime-local" {...register('incidentDateTime')} />
            </FormField>
            <FormField
              label={t('form.incidentDetails.department')}
              required
              error={errors.incidentDepartment?.message}
            >
              <Controller
                name="incidentDepartment"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {t(`form.departments.${dept}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField
              label={t('form.incidentDetails.location')}
              required
              error={errors.incidentLocation?.message}
              className="md:col-span-2"
            >
              <Input
                {...register('incidentLocation')}
                placeholder={t('form.incidentDetails.locationPlaceholder')}
              />
            </FormField>
            <FormField
              label={t('form.incidentDetails.description')}
              required
              error={errors.incidentDescription?.message}
              className="md:col-span-2"
            >
              <Textarea
                {...register('incidentDescription')}
                placeholder={t('form.incidentDetails.descriptionPlaceholder')}
                rows={4}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Section 7: Initial Diagnosis (conditional for patients) */}
        {isPatient && (
          <FormSection title={t('form.initialDiagnosis.title')}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label={t('form.initialDiagnosis.consciousness')}
                error={errors.initialDiagnosis?.consciousness?.message}
              >
                <Controller
                  name="initialDiagnosis.consciousness"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conscious">
                          {t('form.initialDiagnosis.conscious')}
                        </SelectItem>
                        <SelectItem value="unconscious">
                          {t('form.initialDiagnosis.unconscious')}
                        </SelectItem>
                        <SelectItem value="no_consciousness">
                          {t('form.initialDiagnosis.noConsciousness')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField
                label={t('form.initialDiagnosis.mobility')}
                error={errors.initialDiagnosis?.mobility?.message}
              >
                <Controller
                  name="initialDiagnosis.mobility"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">
                          {t('form.initialDiagnosis.mobile')}
                        </SelectItem>
                        <SelectItem value="partially_mobile">
                          {t('form.initialDiagnosis.partiallyMobile')}
                        </SelectItem>
                        <SelectItem value="no_mobility">
                          {t('form.initialDiagnosis.noMobility')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField
                label={t('form.initialDiagnosis.functionalStatus')}
                error={errors.initialDiagnosis?.functionalStatus?.message}
              >
                <Controller
                  name="initialDiagnosis.functionalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="independent">
                          {t('form.initialDiagnosis.independent')}
                        </SelectItem>
                        <SelectItem value="partially_dependent">
                          {t('form.initialDiagnosis.partiallyDependent')}
                        </SelectItem>
                        <SelectItem value="dependent">
                          {t('form.initialDiagnosis.dependent')}
                        </SelectItem>
                        <SelectItem value="bedridden">
                          {t('form.initialDiagnosis.bedridden')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField
                label={t('form.initialDiagnosis.damage')}
                error={errors.initialDiagnosis?.damage?.message}
              >
                <Controller
                  name="initialDiagnosis.damage"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_damage">
                          {t('form.initialDiagnosis.noDamage')}
                        </SelectItem>
                        <SelectItem value="minor_damage">
                          {t('form.initialDiagnosis.minorDamage')}
                        </SelectItem>
                        <SelectItem value="major_damage">
                          {t('form.initialDiagnosis.majorDamage')}
                        </SelectItem>
                        <SelectItem value="unknown">
                          {t('form.initialDiagnosis.unknown')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField
                label={t('form.initialDiagnosis.incidentResults')}
                className="md:col-span-2"
              >
                <Textarea {...register('initialDiagnosis.incidentResultsDetails')} rows={3} />
              </FormField>
            </div>
          </FormSection>
        )}

        {/* Section 8: Incident Handling */}
        <FormSection title={t('form.handling.title')}>
          <FormField label={t('form.handling.reportedTo')}>
            <Controller
              name="incidentHandling.reportedTo"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2 md:grid-cols-3">
                  {reportedToOptions.map((option) => {
                    const labelKey = option
                      .split('_')
                      .map((word, i) =>
                        i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join('');
                    return (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`reported-${option}`}
                          checked={field.value?.includes(option as any)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, option]);
                            } else {
                              field.onChange(currentValue.filter((v) => v !== option));
                            }
                          }}
                        />
                        <Label htmlFor={`reported-${option}`} className="text-sm">
                          {t(`form.handling.${labelKey}`)}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            />
          </FormField>

          {/* Doctor Prognosis */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium">{t('form.doctorPrognosis.title')}</h4>
            <div className="flex items-center space-x-2">
              <Controller
                name="incidentHandling.doctorPrognosis.doctorWasCalled"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="doctor-called"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="doctor-called">{t('form.doctorPrognosis.doctorWasCalled')}</Label>
            </div>

            {doctorWasCalled && (
              <div className="grid gap-4 md:grid-cols-2 pl-6">
                <FormField label={t('form.doctorPrognosis.doctorName')}>
                  <Input {...register('incidentHandling.doctorPrognosis.doctorName')} />
                </FormField>
                <div className="flex items-center space-x-2 mt-8">
                  <Controller
                    name="incidentHandling.doctorPrognosis.examinationOccurred"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="exam-occurred"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="exam-occurred">
                    {t('form.doctorPrognosis.examinationOccurred')}
                  </Label>
                </div>
                <FormField
                  label={t('form.doctorPrognosis.doctorFindings')}
                  className="md:col-span-2"
                >
                  <Textarea
                    {...register('incidentHandling.doctorPrognosis.doctorFindings')}
                    rows={2}
                  />
                </FormField>
                <FormField label={t('form.doctorPrognosis.prognosis')} className="md:col-span-2">
                  <Textarea
                    {...register('incidentHandling.doctorPrognosis.prognosis')}
                    rows={2}
                  />
                </FormField>
              </div>
            )}
          </div>
        </FormSection>

        {/* Section 9: Conclusion and Findings */}
        <FormSection title={t('form.conclusion.title')}>
          <FormField label={t('form.conclusion.contributingIncidents')}>
            <Textarea {...register('contributingIncidents')} rows={3} />
          </FormField>
          <FormField
            label={t('form.conclusion.incidentFindings')}
            required
            error={errors.incidentFindings?.message}
          >
            <Textarea {...register('incidentFindings')} rows={4} />
          </FormField>
          <FormField label={t('form.conclusion.preventiveMeasures')}>
            <Textarea {...register('preventiveMeasures')} rows={3} />
          </FormField>
        </FormSection>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/incidents')}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting || createIncident.isPending}>
            {(isSubmitting || createIncident.isPending) && (
              <Spinner className="mr-2 size-4" />
            )}
            {t('common.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateIncidentPage;
