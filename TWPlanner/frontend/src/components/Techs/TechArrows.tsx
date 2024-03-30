import { useContext } from 'react';
import Xarrow, { anchorType } from 'react-xarrows';
import { AppContext } from '../../contexts/AppContext';

const TechArrows = () => {
  const { state } = useContext(AppContext);
  const { techData } = state;
  return (
    <div>
      {techData?.node_links.map((link, index) => {
        if (link.visible_in_ui || link.visible_in_ui === undefined) {
          return (
            <Xarrow
              key={index}
              start={link.parent_key}
              startAnchor={link.parent_link_position as anchorType}
              end={link.child_key}
              endAnchor={link.child_link_position as anchorType}
              color={'#e7ebe5'}
              divContainerProps={{ className: `${link.parent_key} | ${link.child_key}` }}
              strokeWidth={2}
              headSize={6}
              path="grid"
              zIndex={0}
            />
          );
        }
      })}
    </div>
  );
};

export default TechArrows;
