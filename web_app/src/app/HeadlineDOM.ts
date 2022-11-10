export class AnnotationsDOM {
    idx: number;
    userid: string;
    edit_state: string;
    distortion_category: string;
    dist_headline: string;

    constructor(idx: number, userid: string, edit_state: string, distortion_category: string, dist_headline: string) {
        this.idx = idx;
        this.userid = userid;
        this.edit_state = edit_state;
        this.distortion_category = distortion_category;
        this.dist_headline = dist_headline;
    }

}

export class HeadlineDOM {
    srno: number;
    og_headline: string;
    annotations: AnnotationsDOM[] = [];
    
    constructor(data: string) {
        // console.log(data)
        var headlineData = JSON.parse(data);
        this.srno = headlineData.srno;
        this.og_headline = headlineData.og_headline;
        this.annotations = headlineData.annotations;

        // headlineData.annotations.forEach((anno: { userid: string; edit_state: string; distortion_category: string; dist_headline: string; }, index: any) => {
        //     this.annotations.concat(new AnnotationsDOM(
        //         anno.userid, anno.edit_state, anno.distortion_category, anno.dist_headline
        //     )
        //     );
        // })
    };
}

// export const distortion_categories: String[] = ['Generalization', 'Specialization', 'Hyperbole', 'Meosis'];
export const distortion_categories: String[] = ['Hyperbole', 'Meosis'];