import * as React from 'react';

interface GifProps {
    url: string
}
interface GifState {
}

class Gif extends React.Component <GifProps, GifState> {

    constructor(props: GifProps){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="gif">
                <img 
                    className='gif-img'
                    src={this.props.url} 
                />
            </div>
        );
    }
}

export default Gif;
