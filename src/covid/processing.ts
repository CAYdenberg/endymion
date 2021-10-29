export interface CountryName {
  key: string;
  label: string;
}

export interface CountryData {
  key: string;
  country: string;
  pop: number;
  timeline: Array<{
    dateString: string;
    dateIndex: number;
    cases: number;
  }>;
  coords: Array<[number, number]>;
}

const avg = (input: number[]) =>
  input.reduce((acc, num) => acc + num, 0) / input.length;

export const slidingAverage = (kernel: number) => (data: number[]) => {
  return data.map((_, i) => {
    const sI = i - Math.floor(kernel / 2);
    const windowStart = sI < 0 ? 0 : sI;
    const eI = i + Math.floor(kernel / 2) + 1;
    const windowEnd = eI > data.length ? data.length : eI;
    const window = data.slice(windowStart, windowEnd);
    return avg(window);
  });
};

export const transformToY = (value: number, pop: number) => {
  const raw = Math.log10((1e5 * value) / pop);
  return raw > -6 ? raw : -6;
};

export const processCovidData = (json: any) => {
  const timelineLabels: string[] = json['CHN'].data.map((day: any) => day.date);
  const countryNames: CountryName[] = Object.keys(json).map((key: string) => ({
    key,
    label: json[key].location,
  }));

  const countryData: CountryData[] = Object.keys(json).map((key) => {
    const newCasesSmoothed = slidingAverage(7)(
      json[key].data.map((day: any) => day.new_cases || 0)
    );

    return {
      key,
      country: json[key].location,
      pop: json[key].population,
      timeline: json[key].data.map((day: any) => ({
        dateString: day.date,
        dateIndex: timelineLabels.findIndex((date) => date === day.date),
        cases: day.new_cases || 0,
      })),
      coords: json[key].data.map((day: any, i: number) => {
        const x = timelineLabels.findIndex((date) => date === day.date);
        const y = transformToY(newCasesSmoothed[i], json[key].population);
        return [x, y];
      }),
    };
  });

  return {
    timelineLabels,
    countryNames,
    countryData,
  };
};
