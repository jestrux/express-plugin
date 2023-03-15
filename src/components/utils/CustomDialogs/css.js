export default /*css*/`
*{
    font-family: 'San Francisco', 'Segoe UI', sans-serif;
}

h1{
    font-size: 1.25rem;
    font-weight: bold;
    color: #3F3F3F;
    margin: 0;
    letter-spacing: -0.02em;
}
h2{
    font-size: 1.05rem;
    font-weight: 600;
    color: #3F3F3F;
    margin: 0;
    letter-spacing: -0.02em;
}
input, button{
    margin: 0;
}
.w-1\/3{
    width: 33.333%;
}
.w-full{
    width: 100%;
}
.h-full{
    height: 100%;
}
.h-screen{
    height: 100vh;
}
.min-h-full{
    height: 100%;
}

.button{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
}
.button[uxp-variant="action"]{
    width: 24px;
    border-radius: 50%;
    background: #1473E6;
}
.button[uxp-variant="action"] svg path{
    fill: white;
    width: 20px;
    height: 20px;
}
.button[uxp-variant="cta"]{
    width: 100%;
    height: 28px;
    line-height: 28px;
    font-weight: 600;
    font-size: 13px;
    background: #1473E6;
    color: white;
    border-radius: 14px;
    margin: 0;
}
.button[uxp-variant="cta"].large{
    font-size: 15px;
    height: 36px;
    line-height: 18px;
    border-radius: 20px;
}
.bg-current{
    background: currentColor;
}
.bg-white{
    background: white;
}
.bg-black{
    background: black;
}
.bg-black12{
    background: rgba(0, 0, 0, 0.02);
}
.bg-black26{
    background: rgba(0, 0, 0, 0.05);
}
.bg-black70{
    background: rgba(0, 0, 0, 0.5);
}
.bg-light-gray{
    background: #f0f0f0;
}
.bg-gray{
    background: #e8e8e8;
}
.bg-dark-gray{
    background: #888;
}
.text-blue{
    color: #1473E6;
}
.text-white{
    color: white;
}
.text-black{
    color: black;
}
.text-light-gray{
    color: #f0f0f0;
}
.text-gray{
    /* color: #e8e8e8; */
}
.text-dark-gray{
    color: #888;
}

.text-xs{
    font-size: 0.55rem;
}

.text-sm{
    font-size: 0.65rem;
    line-height: 1.5;
}
.text-md{
    font-size: 0.85rem;
    line-height: 1.5;
}
.text-lg{
    font-size: 1rem;
}
.text-xl{
    font-size: 1.25rem;
}
.text-2xl{
    font-size: 1.7rem;
}
.text-center {
    text-align: center;
}
.font-normal{
    font-weight: 500;
}
.font-medium{
    font-weight: 600;
}
.font-semibold{
    font-weight: 700;
}
.font-bold{
    font-weight: 800;
}
.uppercase {
    text-transform: uppercase;
}
.capitalize {
    text-transform: capitalize;
}

.tracking-wide{
    letter-spacing: 0.025em;
}
.tracking-wider{
    letter-spacing: 0.05em;
}
.tracking-widest{
    letter-spacing: 0.1em;
}

.leading-none{
    line-height: 1;
}

.leading-tight{
    line-height: 1.25;
}
.leading-snug{
    line-height: 1.375;
}

.leading-relaxed{
    line-height: 1.625;
}

.leading-loose{
    line-height: 2;
}

.truncate{
    white-space: nowrap; 
    width: 100%; 
    overflow: hidden; 
    text-overflow: ellipsis;
}

.flex{
    display: flex;
}
.inline-flex{
    display: inline-flex;
}

.block{
    display: block;
}
.hidden{
    display: none;
}

.flex-col{
    flex-direction: column;
}
.center-center,
.items-center{
    align-items: center;
}
.center-center,
.justify-center{
    justify-content: center;
}
.justify-between{
    justify-content: space-between;
}
.justify-start{
    justify-content: flex-start;
}
.items-start{
    align-items: flex-start;
}
.justify-end{
    justify-content: flex-end;
}
.items-end{
    align-items: flex-end;
}
.flex-1{
    flex: 1;
}
.flex-wrap{
    flex-wrap: wrap;
}
.flex-shrink-0{
    flex-shrink: 0;
}
.relative{
    position: relative;
}
.absolute{
    position: absolute;
}
.fixed{
    position: fixed;
}

.inset-0,
.left-0
{
    left: 0;
}

.inset-0,
.right-0
{
    right: 0;
}

.inset-0,
.top-0
{
    top: 0;
}

.inset-0,
.bottom-0
{
    bottom: 0;
}

.z-10{
    z-index: 10;
}
.z-20{
    z-index: 20;
}
.p-0{
    padding: 0;
}
.p-1{
    padding: 0.25rem;
}
.p-2{
    padding: 0.5rem;
}
.p-3{
    padding: 0.75rem;
}
.px-0{
    padding-left: 0;
    padding-right: 0;
}
.px-1{
    padding-left: 0.25rem;
    padding-right: 0.25rem;
}
.px-2{
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
.px-3{
    padding-left: 0.75rem;
    padding-right: 0.75rem;
}
.py-0{
    padding-top: 0;
    padding-bottom: 0;
}
.py-1{
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
}
.py-2{
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}
.py-3{
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
}

.pt-1{
    padding-top: 0.25rem;
}
.pt-2{
    padding-top: 0.5rem;
}
.pt-3{
    padding-top: 0.75rem;
}

.pb-1{
    padding-bottom: 0.25rem;
}
.pb-2{
    padding-bottom: 0.5rem;
}
.pb-3{
    padding-bottom: 0.75rem;
}

.m-auto{
    margin: auto;
}
.ml-auto{
    margin-left: auto;
}
.mr-auto{
    margin-right: auto;
}
.m-0{
    margin: 0;
}
.mx-0{
    margin-left: 0;
    margin-right: 0;
}
.ml-1{
    margin-left: 0.25rem;
}
.ml-2{
    margin-left: 0.5rem;
}
.ml-3{
    margin-left: 0.75rem;
}
.mr-1{
    margin-right: 0.25rem;
}
.mr-2{
    margin-right: 0.5rem;
}
.mr-3{
    margin-right: 0.75rem;
}
.my-0{
    margin-top: 0;
    margin-bottom: 0;
}
.mt-0{
    margin-top: 0;
}
.mt-1{
    margin-top: 0.25rem;
}
.mt-2{
    margin-top: 0.5rem;
}
.mt-3{
    margin-top: 0.75rem;
}
.mb-1{
    margin-bottom: 0.25rem;
}
.mb-2{
    margin-bottom: 0.5rem;
}
.mb-3{
    margin-bottom: 0.75rem;
}

.opacity-75{
    opacity: 0.75;
}
.opacity-65{
    opacity: 0.65;
}
.border,
.border-2,
.border-3,
.border-4,
.border-t,
.border-b,
.border-b-2,
.border-b-3,
.border-b-4{
    border: 1px solid #ddd;
}
.border-2{
    border-width: 2px;
}
.border-3{
    border-width: 3px;
}
.border-4{
    border-width: 4px;
}

.border-t{
    border-width: 1px 0 0 0;
}

.border-b{
    border-width: 0 0 1px 0;
}
.border-b-2{
    border-width: 0 0 2px 0;
}
.border-b-3{
    border-width: 0 0 3px 0;
}
.border-transparent{
    border-color: transparent;
}
.border-blue{
    border-color: #1473E6;
}
.border-black{
    border-color: black;
}
.border-white{
    border-color: white;
}
.border-light-gray{
    border-color: #f0f0f0;
}
.border-dark-gray{
    border-color: #888;
}
.rounded-full{
    border-radius: 50%;
}
.rounded{
    border-radius: 12px;
}
.rounded-lg{
    border-radius: 16px;
}
.rounded-sm{
    border-radius: 6px;
}
.rounded-xs{
    border-radius: 3px;
}
.object-cover{
    object-fit: cover;
}
.object-contain{
    object-fit: contain;
}
.overflow-hidden{
    overflow: hidden;
}
.overflow-x-hidden{
    overflow-x: hidden;
}
.overflow-y-hidden{
    overflow-y: hidden;
}
.overflow-auto{
    overflow: auto;
}
.overflow-y-auto{
    overflow-y: auto;
}
.overflow-x-auto{
    overflow-y: auto;
}
.cursor-pointer{
    cursor: pointer;
}

hr{
    background-color: #cfcfcf;
}
`;