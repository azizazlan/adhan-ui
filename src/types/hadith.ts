export interface Hadith {
  hadithNumber: string;
  headingEnglish: string;
  hadithEnglish: string;
  book: {
    bookName: string;
    writerName: string;
  };
  // Add other properties as needed
}

export interface HadithApiResponse {
  status: number;
  hadiths: {
    data: Hadith[];
  };
}