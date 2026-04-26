import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DayLessonPage from '../components/sequential-course/DayLessonPage';
import { useSequentialCourse } from '../context/SequentialCourseContext';

export default function SequentialCourseLessonPage() {
  const { dayNumber } = useParams();
  const numericDay = Number(dayNumber);
  const { days, refreshDay, loading } = useSequentialCourse();
  const [day, setDay] = useState(() => days.find((item) => item.dayNumber === numericDay) || null);

  useEffect(() => {
    setDay(days.find((item) => item.dayNumber === numericDay) || null);
  }, [days, numericDay]);

  useEffect(() => {
    let active = true;
    refreshDay(numericDay).then((response) => {
      if (active && response) setDay(response);
    });
    return () => {
      active = false;
    };
  }, [numericDay]);

  if (loading && !day) {
    return (
      <section className="section-container py-8 sm:py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center text-sm font-medium text-slate-500 shadow-sm">
          Loading day {numericDay}...
        </div>
      </section>
    );
  }

  if (!day) {
    return (
      <section className="section-container py-8 sm:py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center text-sm font-medium text-slate-500 shadow-sm">
          Day {numericDay} was not found.
        </div>
      </section>
    );
  }

  return (
    <section className="section-container py-8 sm:py-10">
      <DayLessonPage day={day} />
    </section>
  );
}
